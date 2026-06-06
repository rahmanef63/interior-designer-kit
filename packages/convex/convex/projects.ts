import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { spaceType } from "./validators";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
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
    const projectId = await ctx.db.insert("projects", {
      ...args,
      status: "lead",
      currentStage: "lead",
    });
    // Initialise the first stage state.
    await ctx.db.insert("stageStates", {
      projectId,
      stage: "lead",
      status: "in_progress",
      startedAt: Date.now(),
    });
    return projectId;
  },
});
