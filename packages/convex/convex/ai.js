/**
 * Server-side AI inference using the owner's BYOK key.
 * Runs in the Convex default runtime (fetch + Web Crypto available).
 *
 * This is the WEB path. The local runner (local/runner) does the same thing
 * with a key from local/.env instead of the encrypted vault.
 */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { decryptSecret } from "./lib/crypto";
const provider = v.union(v.literal("anthropic"), v.literal("openai"));
export const complete = action({
    args: {
        ownerId: v.string(),
        provider,
        prompt: v.string(),
        system: v.optional(v.string()),
        model: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const rec = await ctx.runQuery(internal.aiKeys._getEncrypted, {
            ownerId: args.ownerId,
            provider: args.provider,
        });
        if (!rec)
            throw new Error(`No ${args.provider} key configured for this owner`);
        const secret = process.env.KEY_VAULT_SECRET;
        if (!secret)
            throw new Error("KEY_VAULT_SECRET is not configured");
        const apiKey = await decryptSecret(rec.encryptedKey, secret);
        if (args.provider === "anthropic") {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                    model: args.model ?? "claude-sonnet-4-6",
                    max_tokens: 1024,
                    system: args.system,
                    messages: [{ role: "user", content: args.prompt }],
                }),
            });
            if (!res.ok)
                throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
            const data = (await res.json());
            return data.content.map((c) => c.text ?? "").join("");
        }
        // openai
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: args.model ?? "gpt-4o",
                messages: [
                    ...(args.system ? [{ role: "system", content: args.system }] : []),
                    { role: "user", content: args.prompt },
                ],
            }),
        });
        if (!res.ok)
            throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
        const data = (await res.json());
        return data.choices[0]?.message.content ?? "";
    },
});
