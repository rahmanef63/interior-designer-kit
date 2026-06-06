import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { leadSource } from "./validators";

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query("clients").order("desc").collect(),
});

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    source: leadSource,
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => ctx.db.insert("clients", args),
});
