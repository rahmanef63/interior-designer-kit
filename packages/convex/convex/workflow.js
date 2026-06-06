import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stage } from "./validators";
/** Mirror of @id/core STAGE_ORDER + gates (kept inline so Convex bundles cleanly). */
const ORDER = [
    "lead", "briefing", "survey", "proposal", "contract", "concept", "layout", "design3d",
    "working_drawing", "rab", "procurement", "production", "site", "qc", "handover", "after_sales",
];
const GATES = {
    lead: "none", briefing: "none", survey: "none", proposal: "client_approval",
    contract: "payment", concept: "client_approval", layout: "client_approval", design3d: "client_approval",
    working_drawing: "internal_qc", rab: "client_approval", procurement: "none", production: "internal_qc",
    site: "none", qc: "internal_qc", handover: "payment", after_sales: "none",
};
/** All stage states for a project (for the pipeline view). */
export const forProject = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, { projectId }) => {
        return await ctx.db
            .query("stageStates")
            .withIndex("by_project", (q) => q.eq("projectId", projectId))
            .collect();
    },
});
/** Mark a stage's gate as cleared (e.g. after payment webhook or sign-off). */
export const clearGate = mutation({
    args: { projectId: v.id("projects"), stage },
    handler: async (ctx, { projectId, stage }) => {
        const state = await ctx.db
            .query("stageStates")
            .withIndex("by_project_stage", (q) => q.eq("projectId", projectId).eq("stage", stage))
            .unique();
        if (!state)
            throw new Error("Stage state not found");
        await ctx.db.patch(state._id, { gateClearedAt: Date.now(), status: "approved" });
    },
});
/** Record an approval and clear the stage gate in one step. */
export const approve = mutation({
    args: {
        projectId: v.id("projects"),
        stage,
        kind: v.union(v.literal("client_approval"), v.literal("internal_qc")),
        approvedBy: v.optional(v.string()),
        comment: v.optional(v.string()),
    },
    handler: async (ctx, { projectId, stage, kind, approvedBy, comment }) => {
        await ctx.db.insert("approvals", { projectId, stage, kind, approved: true, approvedBy, comment });
        const state = await ctx.db
            .query("stageStates")
            .withIndex("by_project_stage", (q) => q.eq("projectId", projectId).eq("stage", stage))
            .unique();
        if (state)
            await ctx.db.patch(state._id, { gateClearedAt: Date.now(), status: "approved" });
    },
});
/** Advance the project to the next stage if the current gate is cleared. */
export const advanceStage = mutation({
    args: { projectId: v.id("projects") },
    handler: async (ctx, { projectId }) => {
        const project = await ctx.db.get(projectId);
        if (!project)
            throw new Error("Project not found");
        const current = project.currentStage;
        const gate = GATES[current] ?? "none";
        const state = await ctx.db
            .query("stageStates")
            .withIndex("by_project_stage", (q) => q.eq("projectId", projectId).eq("stage", current))
            .unique();
        if (gate !== "none" && !state?.gateClearedAt) {
            throw new Error(`Gate "${gate}" not cleared for stage "${current}"`);
        }
        const idx = ORDER.indexOf(current);
        const next = idx >= 0 && idx < ORDER.length - 1 ? ORDER[idx + 1] : null;
        if (!next)
            throw new Error("Project is already at the final stage");
        if (state)
            await ctx.db.patch(state._id, { status: "done", completedAt: Date.now() });
        await ctx.db.insert("stageStates", { projectId, stage: next, status: "in_progress", startedAt: Date.now() });
        await ctx.db.patch(projectId, { currentStage: next });
        return next;
    },
});
