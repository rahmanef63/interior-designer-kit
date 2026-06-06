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

Base scaffold. The spine (state machine, schema, roles, BYOK, local runner) is in
place and runnable. Per-stage modules are specced in `docs/stages/` and built next.
```
Inquiry → Briefing → Survey → Proposal → Kontrak+DP → Konsep → Layout → 3D →
Gambar Kerja → RAB → Procurement → Produksi → Instalasi → QC → Handover → After Sales
```
