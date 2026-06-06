# Stage NN — <name>

> Copy this file per stage. Keep specs short and decision-oriented.

**PIC:** <role> · **Gate out:** none | client_approval | payment | internal_qc

## Goal
What this stage produces and when it's "done".

## Inputs
Data/artifacts from previous stages this module reads.

## Outputs
Documents/records written (map to `DocumentRef.kind` + tables).

## UI (web)
Routes/components under `apps/web/app/projects/[projectId]/...`.

## Data
New tables/fields (add to `packages/convex/convex/schema.ts` + `@id/core` types).

## AI / automation
Which tasks are AI-assisted; local task (`local/runner`) and/or Convex action.

## Heavy compute
Any `/services` call (cad/render/takeoff). Leave blank if none.

## Tech choice
The recommended library/approach and why.
