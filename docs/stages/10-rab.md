# Stage 10 — RAB Final (Bill of Quantities)

**PIC:** estimator · **Gate out:** client_approval

## Goal
Detailed, approved budget: furniture custom, material, finishing, sipil, listrik,
lighting, dekorasi, jasa, transport, contingency.

## Inputs
Approved 3D + working drawings, material specs.

## Outputs
`rabItems` rows (category, unit, qty, unitPriceIdr → `lineTotal`); xlsx export.

## UI (web)
Editable table at `projects/[projectId]/rab` with category subtotals + grand total.

## Tech choice
- Table/calc: in-app (Convex `rabItems` + computed totals via `lineTotal`).
- **xlsx export**: SheetJS in the web app (client-side) for a clean RAB sheet.

## AI / automation
- **Quantity takeoff**: panels/surfaces extracted from the glTF model →
  `services/takeoff` computes board area, plywood sheets, edging metres → seeds
  `rabItems`. Estimator reviews, doesn't start from zero.
- Price lookup: pull last PO prices from `procurement` history.

## Heavy compute — `services/takeoff`
Pure-Python quantity math (see `services/takeoff/main.py`). Returns sheets/area/
edging from the panel list.
