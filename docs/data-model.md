# Data model

Canonical types live in `packages/core/src/types.ts`; the Convex tables in
`packages/convex/convex/schema.ts` mirror them.

## Entities

- **Client** — name, phone, source (whatsapp/instagram/website/referral/walk_in), location.
- **Member** — studio user with a `role` (see roles below).
- **Project** — the spine. `code`, `title`, `clientId`, `spaceType`, `areaSqm`,
  `budgetIdr`, `deadline`, `status`, **`currentStage`**, and `pic` (member per role).
- **StageState** — one row per project per stage: `status`, `gateClearedAt`,
  `assignedTo`. Drives the pipeline and the advance logic.
- **Approval** — `client_approval` or `internal_qc` sign-off that clears a gate.
- **DocumentRef** — files per stage (brief, proposal, render, drawing, BAST…),
  backed by Convex file storage.
- **RabLineItem** — BoQ line: category, unit, qty, unitPriceIdr (→ `lineTotal`).
- **AiKey** — BYOK record; `encryptedKey` only (AES-256-GCM).

## Roles (PIC)

`owner, admin, designer, surveyor, estimator, artist_3d, drafter, pm, workshop,
site_team, client`

Permissions are capability-based (`can(role, capability)` in
`packages/core/src/roles.ts`): `manage_users`, `manage_billing`, `view_finance`,
`approve_stage`, `edit_project`, `view_project`, `use_ai`.

## State machine

`Project.currentStage` walks `STAGE_ORDER` (1→16). `advanceStage` only proceeds
when the current stage's gate is cleared:

- `client_approval` → an approved `Approval` row (or `clearGate`)
- `payment` → invoice/termin paid (webhook calls `clearGate`)
- `internal_qc` → internal sign-off
- `none` → advances freely
