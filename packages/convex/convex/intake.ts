/**
 * Lead intake automation: inbound message -> AI parse -> Client + Project.
 *
 * Uses the STUDIO system key (process.env.ANTHROPIC_API_KEY) — backend
 * automation with no user in context, separate from per-user BYOK keys.
 * Called by the WhatsApp webhook in http.ts.
 */
import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { leadSource, spaceType } from "./validators";
import { sendWhatsAppText } from "./lib/whatsapp";
import { nextProjectCode } from "./_shared/codes";

type LeadFields = {
  name: string;
  phone?: string;
  source?: "whatsapp" | "instagram" | "website" | "referral" | "walk_in" | "other";
  spaceType?: "rumah" | "kos" | "cafe" | "kantor" | "hotel" | "retail" | "other";
  areaSqm?: number;
  budgetIdr?: number;
  location?: string;
  needs?: string;
};

const LEAD_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", description: "Nama calon klien" },
    phone: { type: "string" },
    spaceType: { type: "string", enum: ["rumah", "kos", "cafe", "kantor", "hotel", "retail", "other"] },
    areaSqm: { type: "number", description: "Luas area m2" },
    budgetIdr: { type: "number", description: "Budget dalam rupiah (150jt = 150000000)" },
    location: { type: "string" },
    needs: { type: "string", description: "Kebutuhan utama, ringkas" },
  },
  required: ["name"],
} as const;

async function parseLead(text: string): Promise<LeadFields> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY (studio system key) is not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 512,
      tools: [{ name: "emit_lead", description: "Structured interior-design lead.", input_schema: LEAD_SCHEMA }],
      tool_choice: { type: "tool", name: "emit_lead" },
      messages: [{ role: "user", content: `Pesan calon klien (WhatsApp):\n${text}` }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { content: Array<{ type: string; input?: LeadFields }> };
  const toolUse = data.content.find((c) => c.type === "tool_use");
  if (!toolUse?.input) throw new Error("Model did not return a structured lead");
  return toolUse.input;
}

/** Internal: AI-parse one inbound message, create the lead project, auto-reply. */
export const processInbound = internalAction({
  args: { from: v.string(), text: v.string() },
  handler: async (ctx, { from, text }): Promise<{ code: string }> => {
    const fields = await parseLead(text);
    const { code, title } = await ctx.runMutation(internal.intake.createFromLead, {
      name: fields.name,
      phone: fields.phone ?? from,
      source: "whatsapp",
      spaceType: fields.spaceType,
      areaSqm: fields.areaSqm,
      budgetIdr: fields.budgetIdr,
      location: fields.location,
      needs: fields.needs,
    });
    await sendWhatsAppText(
      from,
      `Halo! Terima kasih sudah menghubungi kami. 🙏\n` +
        `Inquiry-mu "${title}" sudah kami catat (No. ${code}).\n` +
        `Tim kami akan segera menghubungi untuk jadwal survey lokasi.`,
    );
    return { code };
  },
});

/** Internal: create Client + Project + first StageState atomically. */
export const createFromLead = internalMutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    source: leadSource,
    spaceType: v.optional(spaceType),
    areaSqm: v.optional(v.number()),
    budgetIdr: v.optional(v.number()),
    location: v.optional(v.string()),
    needs: v.optional(v.string()),
  },
  handler: async (ctx, a) => {
    const clientId = await ctx.db.insert("clients", {
      name: a.name,
      phone: a.phone,
      source: a.source,
      location: a.location,
    });
    const code = await nextProjectCode(ctx);
    const title = a.needs ?? `${a.spaceType ?? "Project"} — ${a.name}`;
    const projectId = await ctx.db.insert("projects", {
      code,
      title,
      clientId,
      spaceType: a.spaceType ?? "other",
      areaSqm: a.areaSqm,
      budgetIdr: a.budgetIdr,
      status: "lead",
      currentStage: "lead",
    });
    await ctx.db.insert("stageStates", { projectId, stage: "lead", status: "in_progress", startedAt: Date.now() });
    return { projectId, code, title };
  },
});
