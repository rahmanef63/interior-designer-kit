import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { spaceType, leadSource } from "./validators";
import { requireUser } from "./_shared/auth";
import { nextProjectCode } from "./_shared/codes";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.db.query("projects").order("desc").take(500);
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    code: v.string(),
    title: v.string(),
    clientId: v.id("clients"),
    spaceType,
    areaSqm: v.optional(v.number()),
    budgetIdr: v.optional(v.number()),
    deadline: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const projectId = await ctx.db.insert("projects", { ...args, status: "lead", currentStage: "lead" });
    await ctx.db.insert("stageStates", { projectId, stage: "lead", status: "in_progress", startedAt: Date.now() });
    return projectId;
  },
});

/** Create a client + project together (used by the manual "New project" form). */
export const createWithClient = mutation({
  args: {
    clientName: v.string(),
    phone: v.optional(v.string()),
    source: leadSource,
    title: v.string(),
    spaceType,
    areaSqm: v.optional(v.number()),
    budgetIdr: v.optional(v.number()),
    deadline: v.optional(v.number()),
  },
  handler: async (ctx, a) => {
    await requireUser(ctx);
    const clientId = await ctx.db.insert("clients", { name: a.clientName, phone: a.phone, source: a.source });
    const code = await nextProjectCode(ctx);
    const projectId = await ctx.db.insert("projects", {
      code,
      title: a.title,
      clientId,
      spaceType: a.spaceType,
      areaSqm: a.areaSqm,
      budgetIdr: a.budgetIdr,
      deadline: a.deadline,
      status: "active",
      currentStage: "lead",
    });
    await ctx.db.insert("stageStates", { projectId, stage: "lead", status: "in_progress", startedAt: Date.now() });
    return { projectId, code };
  },
});
