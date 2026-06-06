import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { spaceType, leadSource } from "./validators";
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
        const clientId = await ctx.db.insert("clients", {
            name: a.clientName,
            phone: a.phone,
            source: a.source,
        });
        const count = (await ctx.db.query("projects").collect()).length;
        const code = `ID-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
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
        await ctx.db.insert("stageStates", {
            projectId,
            stage: "lead",
            status: "in_progress",
            startedAt: Date.now(),
        });
        return { projectId, code };
    },
});
