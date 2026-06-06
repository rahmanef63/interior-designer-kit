/**
 * BYOK key vault. Web users submit their own AI key; it is encrypted with the
 * server-side KEY_VAULT_SECRET before being stored. Plaintext never hits the DB.
 */
import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { encryptSecret } from "./lib/crypto";
import { requireUser } from "./_shared/auth";

const provider = v.union(v.literal("anthropic"), v.literal("openai"));

/** Public: encrypt + store a user-supplied key. */
export const store = action({
  args: { ownerId: v.string(), provider, apiKey: v.string(), label: v.optional(v.string()) },
  handler: async (ctx, args): Promise<void> => {
    await requireUser(ctx);
    const secret = process.env.KEY_VAULT_SECRET;
    if (!secret) throw new Error("KEY_VAULT_SECRET is not configured");
    const encryptedKey = await encryptSecret(args.apiKey, secret);
    await ctx.runMutation(internal.aiKeys._insert, {
      ownerId: args.ownerId,
      provider: args.provider,
      encryptedKey,
      label: args.label,
    });
  },
});

/** Internal: replace any existing key for this owner+provider, then insert. */
export const _insert = internalMutation({
  args: { ownerId: v.string(), provider, encryptedKey: v.string(), label: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aiKeys")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .take(500);
    for (const k of existing) if (k.provider === args.provider) await ctx.db.delete(k._id);
    await ctx.db.insert("aiKeys", args);
  },
});

/** Internal: fetch the ciphertext for decryption inside an action. */
export const _getEncrypted = internalQuery({
  args: { ownerId: v.string(), provider },
  handler: async (ctx, { ownerId, provider }) => {
    const keys = await ctx.db
      .query("aiKeys")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .take(500);
    return keys.find((k) => k.provider === provider) ?? null;
  },
});

/** Public: which providers does this owner have configured (no secrets returned). */
export const list = query({
  args: { ownerId: v.string() },
  handler: async (ctx, { ownerId }) => {
    await requireUser(ctx);
    const keys = await ctx.db
      .query("aiKeys")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .take(500);
    return keys.map((k) => ({ provider: k.provider, label: k.label }));
  },
});
