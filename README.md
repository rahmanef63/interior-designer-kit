# Interior Studio

AI-assisted platform for an interior design studio. One project flows through
**16 stages** (lead → handover → after sales), with a studio team and role-based
PICs. Runs two ways:

- **Local (Windows):** `.bat` scripts that run AI function-calling with your own
  key (`local/.env`). Offline-friendly.
- **Web:** Next.js + Convex, deployed to Vercel, **BYOK** (users bring their own
  AI key, encrypted at rest).

> New here? Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) first, then
> [`docs/workflow.md`](./docs/workflow.md).

## Structure

```
apps/web        Next.js app + client portal (Vercel)
packages/core   types + 16-stage state machine + roles (shared)
packages/convex backend: schema, workflow, BYOK vault, automations
services/       compute plane (Python): cad · render · takeoff
local/          Windows runner: .bat + function-calling CLI
docs/           workflow, data model, per-stage specs
```

## Quickstart — web

```bash
pnpm install
pnpm --filter @id/convex dev     # first run generates convex/_generated/*
pnpm --filter @id/web dev        # http://localhost:3000
```

Set `apps/web/.env.local` → `NEXT_PUBLIC_CONVEX_URL`. In the Convex dashboard set
`KEY_VAULT_SECRET` (BYOK encryption):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Quickstart — local runner (Windows)

```bat
REM No key needed — stub run to see the function-calling loop:
local\scripts\lead-parse.bat "Bu Sari, butuh desain cafe 80m2 budget 150jt di Bandung" --dry-run

REM Real run: copy local\.env.example to local\.env, add your key, then:
local\scripts\lead-parse.bat "Bu Sari, butuh desain cafe 80m2 budget 150jt di Bandung"
```

Outputs land in `local/output/`.

## Tech

Next.js · Convex · Turborepo · React Three Fiber (3D) · Konva (2D layout) ·
SheetJS (RAB export) · FastAPI + ezdxf (CAD) · Replicate/Fal (AI render).
Deploy: Vercel (web) · Convex Cloud (backend) · Railway/Fly/Modal (services).

## Status

**Wired MVP.** You can create a project and click it through all 16 stages.

Done:
- Spine: 16-stage state machine + gates, schema, roles/PIC, BYOK vault.
- Web app with a **swappable data layer** (`apps/web/lib/data`): runs on in-memory
  **mock data by default (zero backend)** or Convex with a one-line switch. Live
  pipeline board, new-project form, project detail with stage tracker +
  `Lanjut`/`Setujui`/`Mulai Briefing` actions. State machine is unit-tested.
- Automations: lead intake (WhatsApp → AI → Project) and lead → briefing
  (auto-reply, generate brief, assign designer, schedule survey, advance).
- Local runner (Windows `.bat` + function-calling) and 16/16 stage specs in `docs/stages/`.

Roadmap (not built yet):
- Auth / multi-tenant (Convex Auth or Clerk).
- Heavy modules: 3D (R3F), 2D layout (Konva), working drawings (ezdxf).
- Live payments (Midtrans/Xendit) and the remaining 14 stage automations.

### Run it — dogfood (zero backend)
```bash
pnpm install
pnpm --filter @id/web dev      # http://localhost:3000/dashboard
```
Default is mock mode (6 seeded projects across stages). Click through the
pipeline, create projects, advance stages, approve gates, start briefing — all
in-memory. A "MOCK" badge shows in the nav.

### Switch to Convex
1. `pnpm --filter @id/convex dev` then `npx convex run seed:run`
2. In `apps/web/lib/data/index.ts`: comment the two `mock` lines, uncomment the
   two `convex` lines. Set `apps/web/.env.local` → `NEXT_PUBLIC_CONVEX_URL`.

For BYOK/automation set `KEY_VAULT_SECRET` + `ANTHROPIC_API_KEY` in the Convex
deployment env. See `apps/web/lib/data/README.md`.
```
Inquiry → Briefing → Survey → Proposal → Kontrak+DP → Konsep → Layout → 3D →
Gambar Kerja → RAB → Procurement → Produksi → Instalasi → QC → Handover → After Sales
```
