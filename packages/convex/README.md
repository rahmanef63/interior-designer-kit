# @id/convex — backend (app plane)

Real-time database, server functions, file storage, and scheduled automations.
This is the shared backend for both the web app and (optionally) the local runner.

## Setup

```bash
pnpm --filter @id/convex dev   # first run generates convex/_generated/*
```

The `convex/_generated/` folder does not exist until you run `convex dev` once.
TypeScript errors about `./_generated/server` or `./_generated/api` are expected
until then.

Set deployment env vars (in the Convex dashboard, not committed):

- `KEY_VAULT_SECRET` — base64 32-byte key for BYOK encryption. Generate:
  `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

## Files

| File | Purpose |
|---|---|
| `schema.ts` | Tables: members, clients, projects, stageStates, approvals, documents, rabItems, aiKeys |
| `validators.ts` | Shared `v.union` validators (mirror @id/core) |
| `projects.ts` | `list`, `get`, `create` |
| `workflow.ts` | `forProject`, `clearGate`, `approve`, `advanceStage` (16-stage gate logic) |
| `aiKeys.ts` | BYOK: `store` (encrypt), `list`, internal helpers |
| `ai.ts` | `complete` — server-side inference with the owner's BYOK key |
| `automation.ts` | `checkDeadlines` (backbone automation) |
| `crons.ts` | Scheduled jobs |
| `lib/crypto.ts` | AES-256-GCM helper (Web Crypto) |

## Notes

- The **state machine** lives in `workflow.ts`. A project advances only when the
  current stage's gate (`client_approval` / `payment` / `internal_qc`) is cleared.
- Heavy compute (3D render, CAD/DXF, takeoff) is **not** here — Convex `actions`
  call the external services in `/services` and store the result.
