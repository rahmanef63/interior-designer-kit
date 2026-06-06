import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";

/** Throw unless a user is signed in. Works in queries, mutations, and actions. */
export async function requireUser(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}

/** Throw unless the signed-in user maps (by email) to an active owner/admin member. */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await requireUser(ctx);
  const user = await ctx.db.get(userId);
  const email = (user as { email?: string } | null)?.email;
  if (email) {
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (member && member.active && (member.role === "owner" || member.role === "admin")) {
      return userId;
    }
  }
  throw new Error("Forbidden: admin only");
}
