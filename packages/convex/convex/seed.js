/** Seed a studio team so auto-assign (PIC) works. Run: `npx convex run seed:run`. */
import { internalMutation } from "./_generated/server";
export const run = internalMutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("members").collect();
        if (existing.length > 0)
            return { skipped: true, members: existing.length };
        const members = [
            { name: "Owner", email: "owner@studio.id", role: "owner", active: true },
            { name: "Admin Sari", email: "admin@studio.id", role: "admin", active: true },
            { name: "Designer Dewi", email: "designer@studio.id", role: "designer", active: true },
            { name: "Surveyor Budi", email: "surveyor@studio.id", role: "surveyor", active: true },
            { name: "Estimator Rian", email: "estimator@studio.id", role: "estimator", active: true },
            { name: "3D Artist Galih", email: "3d@studio.id", role: "artist_3d", active: true },
            { name: "Drafter Wawan", email: "drafter@studio.id", role: "drafter", active: true },
            { name: "PM Tono", email: "pm@studio.id", role: "pm", active: true },
        ];
        for (const m of members)
            await ctx.db.insert("members", m);
        // A sample lead so the pipeline board isn't empty.
        const clientId = await ctx.db.insert("clients", {
            name: "Bu Sari",
            phone: "628123456789",
            source: "whatsapp",
            location: "Bandung",
        });
        const projectId = await ctx.db.insert("projects", {
            code: "ID-2026-001",
            title: "Desain cafe 80m2",
            clientId,
            spaceType: "cafe",
            areaSqm: 80,
            budgetIdr: 150000000,
            status: "active",
            currentStage: "lead",
        });
        await ctx.db.insert("stageStates", {
            projectId,
            stage: "lead",
            status: "in_progress",
            startedAt: Date.now(),
        });
        return { seeded: members.length, sampleProject: "ID-2026-001" };
    },
});
