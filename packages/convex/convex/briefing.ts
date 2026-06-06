/**
 * Stage 1 → 2 handoff automation (lead → briefing).
 *
 * startBriefing() orchestrates: generate design brief (AI) → auto-assign a
 * designer → schedule the survey → advance the stage → notify the client on
 * WhatsApp. Triggered by the admin's "Mulai Briefing" action (or automation).
 */
import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { role } from "./validators";
import { sendWhatsAppText } from "./lib/whatsapp";

type Brief = {
  summary: string;
  fungsi?: string;
  style?: string;
  prioritas?: string;
  timeline?: string;
  scope?: string;
};

const BRIEF_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "Ringkasan brief dalam markdown" },
    fungsi: { type: "string", description: "Fungsi ruang yang diinginkan" },
    style: { type: "string", description: "Gaya/style desain" },
    prioritas: { type: "string", description: "Prioritas utama klien" },
    timeline: { type: "string" },
    scope: { type: "string", description: "Scope pekerjaan ringkas" },
  },
  required: ["summary"],
} as const;

async function generateBriefText(input: {
  title: string;
  spaceType: string;
  areaSqm?: number;
  budgetIdr?: number;
  needs: string;
}): Promise<Brief> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY (studio system key) is not configured");

  const prompt =
    `Buat design brief interior dari data lead berikut (Bahasa Indonesia, ringkas, actionable):\n` +
    `- Judul: ${input.title}\n- Jenis ruang: ${input.spaceType}\n` +
    `- Luas: ${input.areaSqm ?? "?"} m2\n- Budget: Rp ${input.budgetIdr?.toLocaleString("id-ID") ?? "?"}\n` +
    `- Kebutuhan: ${input.needs}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 1024,
      tools: [{ name: "emit_brief", description: "Structured design brief.", input_schema: BRIEF_SCHEMA }],
      tool_choice: { type: "tool", name: "emit_brief" },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { content: Array<{ type: string; input?: Brief }> };
  const tool = data.content.find((c) => c.type === "tool_use");
  if (!tool?.input) throw new Error("Model did not return a structured brief");
  return tool.input;
}

/** Load project + client for the brief prompt and notifications. */
export const projectContext = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (!project) throw new Error("Project not found");
    const client = await ctx.db.get(project.clientId);
    return { project, client };
  },
});

/** Assign the first active member with the target role; returns their id or null. */
export const autoAssignPic = internalMutation({
  args: { projectId: v.id("projects"), role },
  handler: async (ctx, { projectId, role }) => {
    const members = await ctx.db.query("members").take(500);
    const pick = members.find((m) => m.role === role && m.active);
    if (!pick) return null;
    const project = await ctx.db.get(projectId);
    const pic = (project?.pic ?? [])
      .filter((p) => p.role !== role)
      .concat([{ role, memberId: pick._id }]);
    await ctx.db.patch(projectId, { pic });
    return pick._id;
  },
});

/** Schedule the site survey (default: +2 days). */
export const scheduleSurvey = internalMutation({
  args: { projectId: v.id("projects"), at: v.optional(v.number()) },
  handler: async (ctx, { projectId, at }) => {
    const when = at ?? Date.now() + 2 * 24 * 60 * 60 * 1000;
    await ctx.db.patch(projectId, { surveyAt: when });
    return when;
  },
});

export const saveBrief = internalMutation({
  args: {
    projectId: v.id("projects"),
    summary: v.string(),
    fungsi: v.optional(v.string()),
    style: v.optional(v.string()),
    prioritas: v.optional(v.string()),
    timeline: v.optional(v.string()),
    scope: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("briefs", args);
    await ctx.db.insert("documents", {
      projectId: args.projectId,
      stage: "briefing",
      kind: "brief",
      name: "Design Brief",
    });
  },
});

/** Orchestrator — the full lead→briefing handoff. Callable from the web. */
export const startBriefing = action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }): Promise<{ surveyAt: number; designerAssigned: boolean }> => {
    const { project, client } = await ctx.runQuery(internal.briefing.projectContext, { projectId });

    // 1. Generate the brief.
    const brief = await generateBriefText({
      title: project.title,
      spaceType: project.spaceType,
      areaSqm: project.areaSqm,
      budgetIdr: project.budgetIdr,
      needs: project.title,
    });
    await ctx.runMutation(internal.briefing.saveBrief, { projectId, ...brief });

    // 2. Auto-assign a designer.
    const designerId = await ctx.runMutation(internal.briefing.autoAssignPic, { projectId, role: "designer" });

    // 3. Schedule the survey.
    const surveyAt = await ctx.runMutation(internal.briefing.scheduleSurvey, { projectId, at: undefined });

    // 4. Advance lead → briefing (lead gate is "none").
    await ctx.runMutation(api.workflow.advanceStage, { projectId });

    // 5. Notify the client.
    if (client?.phone) {
      const when = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full", timeStyle: "short", timeZone: "Asia/Jakarta",
      }).format(new Date(surveyAt));
      await sendWhatsAppText(
        client.phone,
        `Update untuk project "${project.title}" (${project.code}):\n` +
          `Brief awal sudah kami siapkan dan tim desain ditugaskan.\n` +
          `Usulan jadwal survey lokasi: ${when} WIB. Balas untuk konfirmasi/ubah. 🙏`,
      );
    }

    return { surveyAt, designerAssigned: designerId !== null };
  },
});
