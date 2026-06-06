import type { MutationCtx } from "../_generated/server";

/**
 * Next project code (ID-YYYY-NNN). Reads only the most recent project
 * (`.order("desc").take(1)`) instead of scanning the table — honors the
 * "no bare .collect()" rule.
 */
export async function nextProjectCode(ctx: MutationCtx): Promise<string> {
  const latest = await ctx.db.query("projects").order("desc").take(1);
  const year = new Date().getFullYear();
  let n = 1;
  const code = latest[0]?.code;
  if (code) {
    const m = code.match(/-(\d+)$/);
    if (m) n = parseInt(m[1], 10) + 1;
  }
  return `ID-${year}-${String(n).padStart(3, "0")}`;
}
