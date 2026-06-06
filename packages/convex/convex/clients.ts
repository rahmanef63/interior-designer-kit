import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { leadSource } from "./validators";
import { requireUser } from "./_shared/auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.db.query("clients").order("desc").take(500);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    source: leadSource,
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    return await ctx.db.insert("clients", args);
  },
});
