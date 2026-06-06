/** Seed a studio team so auto-assign (PIC) works. Run: `npx convex run seed:run`. */
import { internalMutation } from "./_generated/server";

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("members").collect();
    if (existing.length > 0) return { skipped: true, members: existing.length };

    const members = [
      { name: "Owner", email: "owner@studio.id", role: "owner" as const, active: true },
      { name: "Admin Sari", email: "admin@studio.id", role: "admin" as const, active: true },
      { name: "Designer Dewi", email: "designer@studio.id", role: "designer" as const, active: true },
      { name: "Surveyor Budi", email: "surveyor@studio.id", role: "surveyor" as const, active: true },
      { name: "Estimator Rian", email: "estimator@studio.id", role: "estimator" as const, active: true },
      { name: "3D Artist Galih", email: "3d@studio.id", role: "artist_3d" as const, active: true },
      { name: "Drafter Wawan", email: "drafter@studio.id", role: "drafter" as const, active: true },
      { name: "PM Tono", email: "pm@studio.id", role: "pm" as const, active: true },
    ];
    for (const m of members) await ctx.db.insert("members", m);
    return { seeded: members.length };
  },
});
