# Architecture — Interior Studio

AI-assisted platform for an interior design studio. One project flows through 16
stages (lead → handover → after sales). Runs two ways: a **local Windows runner**
(`.bat` + function-calling, your own key) and a **web app** (Next.js + Convex,
BYOK). Studio team with role-based PICs.

---

## 1. Core principles

### Two planes (this is the key decision)
- **App plane** — Next.js + Convex + Vercel. Real-time CRUD, light, drives all 16
  stages. Fast and cheap.
- **Compute plane** — `/services` (Python, optionally GPU). 3D render, CAD/DXF,
  quantity takeoff. Called **async** from Convex actions; results stored back.

Heavy work never runs on Vercel/Convex (timeouts, memory, no GPU). This split is
what keeps the app responsive — the answer to "performa tidak berkurang".

### Spine + modules
- **Spine (~80%, global):** `Project` entity, the 16-stage state machine, clients,
  members/roles, documents, finance, notifications, dashboard.
- **Modules (~20%, per stage):** each stage adds its own data + views, plugged
  into the same `Project`. Not 16 separate tools — one project, many modules.
  Specs in `docs/stages/`.

### Hybrid execution
- **Local:** `local/scripts/*.bat` → `local/runner` function-calling loop, key in
  `local/.env`. Offline-friendly, good for heavy/local tasks.
- **Web:** BYOK — each user/studio stores their own AI key, encrypted at rest;
  inference runs in `packages/convex/convex/ai.ts`.

---

## 2. Monorepo layout

```
interior-design/
├─ apps/
│  └─ web/              Next.js app + client portal → Vercel
├─ packages/
│  ├─ core/             types + 16-stage state machine + roles (shared spine)
│  ├─ convex/           backend: schema, workflow, BYOK vault, automations
│  └─ ui/               shared components (stub)
├─ services/            compute plane (Python, FastAPI): cad · render · takeoff
├─ local/
│  ├─ runner/           Node function-calling CLI (BYOK via local/.env)
│  └─ scripts/          Windows .bat wrappers
└─ docs/                workflow, data model, per-stage specs
```

Tooling: pnpm workspaces + Turborepo. `@id/core` is imported by web, convex, and
(conceptually) the runner so the workflow stays in one place.

---

## 3. The state machine

`Project.currentStage` walks `STAGE_ORDER` (1→16). Defined in
`packages/core/src/stages.ts`; enforced in `packages/convex/convex/workflow.ts`.

A project advances only when the current stage's **gate** clears:

| Gate | Cleared by |
|---|---|
| `none` | advances freely |
| `client_approval` | an approved `Approval` row / `clearGate` |
| `payment` | invoice/termin paid → webhook calls `clearGate` |
| `internal_qc` | internal sign-off |

`advanceStage(projectId)` checks the gate, closes the current `StageState`, opens
the next, and updates `currentStage`. See `docs/workflow.md` for the full table.

---

## 4. Roles & permissions

11 roles: `owner, admin, designer, surveyor, estimator, artist_3d, drafter, pm,
workshop, site_team, client`. Capability-based — `can(role, capability)` in
`packages/core/src/roles.ts`. Each project assigns a member per role (`pic`).

---

## 5. Tech per stage

| Stage | App layer | AI / automation | Heavy compute |
|---|---|---|---|
| 1 Lead | Convex form + CRM | Parse WA/IG/email → struktur | — |
| 2 Briefing | form | Voice→transcribe→brief | — |
| 3 Survey | media upload + ukur | Auto-tag foto | Photogrammetry (opt) |
| 4 Proposal | PDF/template | Draft scope+harga | — |
| 5 Kontrak & DP | e-sign + invoice | Generate kontrak | Payment (Midtrans/Xendit) |
| 6 Konsep | moodboard | Image-gen, palette | AI image gen (GPU) |
| 7 Layout | **Konva.js** 2D | Auto-layout & sirkulasi | — |
| 8 3D/Visual | **R3F + drei** | AI render dari depth/canny | `services/render` (GPU) |
| 9 Gambar Kerja | viewer + markup | Auto denah/titik | `services/cad` (ezdxf) |
| 10 RAB | table + **SheetJS** | Quantity takeoff | `services/takeoff` |
| 11 Procurement | PO + vendor | Auto-PO, cek harga | — |
| 12 Produksi | kanban + QC | Jadwal produksi | — |
| 13 Site | daily log, foto | Ringkas progress | — |
| 14 QC | checklist | Punch list dari foto (vision) | — |
| 15 Handover | BAST + warranty | Generate BAST | — |
| 16 After Sales | follow-up | Follow-up terjadwal | — |

### Three.js (Stage 8) — keep it fast
R3F + drei. glTF + Draco/Meshopt, instancing for repeated furniture,
`frameloop="demand"`, LOD, baked lighting, viewer as `dynamic(..., {ssr:false})`.
**Don't** path-trace in the browser — send a depth/canny map to `services/render`
(SD + ControlNet, GPU) for the photoreal output. Three.js = editor; AI = render.

### Python (Stages 9, 10) — only where it wins
CAD/DXF (ezdxf), quantity takeoff, ML pipelines. Always a separate FastAPI
service called from a Convex action — never bundled into Vercel.

---

## 6. BYOK security

Web users submit their own AI key. The flow:

1. `Settings` → `aiKeys.store` (Convex **action**) encrypts with AES-256-GCM
   (`lib/crypto.ts`, key = `KEY_VAULT_SECRET`) → stores ciphertext only.
2. Inference: `ai.complete` loads the ciphertext, decrypts in the action, calls
   the provider with `fetch`. Plaintext never touches the database or the client
   after submit.

Local runner is simpler: the key sits in `local/.env` on the user's machine.

---

## 7. Deployment

| Piece | Where |
|---|---|
| `apps/web` | Vercel |
| `packages/convex` | Convex Cloud (`convex deploy`) |
| `services/*` | Railway / Fly / Modal (separate; GPU for render) |
| AI render/image | Replicate / Fal (provider GPU) |
| Local runner | the designer's Windows machine (Node 20+) |
| Payments / WA | Midtrans or Xendit · WhatsApp Business API |

---

## 8. Automation backbone

Convex **scheduled functions + actions** are the engine (`crons.ts`,
`automation.ts`). Stage transitions trigger side effects: generate documents,
send WA/email, create invoices, assign the next PIC. `checkDeadlines` is the
seed example.

---

## 9. Next steps

1. `pnpm install`, then `convex dev` (generates `_generated/`), then `web dev`.
2. Pick a first module to flesh out — Layout (7) or 3D (8) are highest-leverage.
3. Wire one real automation end-to-end (e.g. lead intake from WhatsApp → Convex).
4. Add auth (Convex Auth / Clerk) and the client portal.

See `README.md` for commands and `docs/` for details.
