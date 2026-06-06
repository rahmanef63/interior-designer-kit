/** Read models for the web UI (denormalized joins). */
import { query } from "./_generated/server";
import { v } from "convex/values";

/** Projects for the pipeline board, with client name resolved. */
export const dashboard = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").order("desc").collect();
    const clients = await ctx.db.query("clients").collect();
    const nameById = new Map(clients.map((c) => [c._id, c.name]));
    return projects.map((p) => ({
      _id: p._id,
      code: p.code,
      title: p.title,
      status: p.status,
      currentStage: p.currentStage,
      spaceType: p.spaceType,
      budgetIdr: p.budgetIdr,
      clientName: nameById.get(p.clientId) ?? "—",
    }));
  },
});

/** Everything the project detail page needs in one round-trip. */
export const projectDetail = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (!project) return null;
    const client = await ctx.db.get(project.clientId);
    const stageStates = await ctx.db
      .query("stageStates")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect();
    const brief = await ctx.db
      .query("briefs")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect();
    const members = await ctx.db.query("members").collect();
    const memberById = new Map(members.map((m) => [m._id, m]));
    const pic = (project.pic ?? []).map((a) => ({
      role: a.role,
      name: memberById.get(a.memberId)?.name ?? "—",
    }));
    return { project, client, stageStates, brief, documents, pic };
  },
});
