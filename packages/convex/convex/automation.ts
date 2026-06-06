/** Backbone automations triggered by crons.ts or stage transitions. */
import { internalMutation } from "./_generated/server";

/** Flag active projects whose deadline is within 3 days. */
export const checkDeadlines = internalMutation({
  args: {},
  handler: async (ctx) => {
    const soon = Date.now() + 3 * 24 * 60 * 60 * 1000;
    const active = await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
    const atRisk = active.filter((p) => p.deadline && p.deadline < soon);
    // TODO: notify the PM via WhatsApp/email (see RENDER/WA integrations in .env).
    return { atRisk: atRisk.map((p) => p.code) };
  },
});
