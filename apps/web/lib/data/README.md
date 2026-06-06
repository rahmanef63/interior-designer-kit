# lib/data — data layer (mock ↔ Convex)

Pages import data hooks ONLY from `@/lib/data`. The backend is swappable in one
place (`index.ts`) so the UI never changes.

```
index.ts       ← the switch (mock by default)
types.ts       ← shared shapes (DashboardProject, ProjectDetailData, …)
store.ts       ← in-memory store + workflow state machine (pure, testable)
mock.ts        ← React provider over the store (useSyncExternalStore)
convexApi.ts   ← React provider over Convex (enable after `convex dev`)
```

## Modes

- **mock** (default) — in-memory, seeded with 6 sample projects across stages.
  No backend needed: `pnpm --filter @id/web dev` and click through everything.
  The gate/advance logic is real (reuses `@id/core` STAGES + nextStage).
- **convex** — real backend. Enable in `index.ts` after `convex dev`.

## Switching to Convex

1. `pnpm --filter @id/convex dev`
2. In `index.ts`: comment the two `mock` lines, uncomment the two `convex` lines.

That's it — same hooks (`useDashboard`, `useProjectDetail`, `useProjectActions`),
same pages.

## Why this shape

`store.ts` holds the state machine as pure functions, so it's unit-testable
without React or Convex (see the workflow test). `mock.ts` and `convexApi.ts` are
thin adapters with identical signatures.
