# Stage 07 — Layout & Space Planning

**PIC:** designer · **Gate out:** client_approval

## Goal
2D denah baru: posisi furniture, zonasi, sirkulasi, ukuran utama. Approved layout
feeds the 3D stage.

## Inputs
Survey measurements (existing denah), brief (fungsi & prioritas).

## Outputs
`DocumentRef{kind:"layout"}` (denah JSON + PNG export), zonasi & flow notes.

## UI (web)
2D canvas editor at `projects/[projectId]/layout`.

## Tech choice — **Konva.js** (react-konva)
Best fit for a 2D plan editor in React: scene graph, drag/snap, hit-testing,
export to image. Lighter than a full CAD engine, runs at 60fps for hundreds of
shapes. Alternative: Fabric.js (similar). Avoid raw `<canvas>` — you'll rebuild
a scene graph by hand.

## AI / automation
- Auto-layout: given room polygon + program (e.g. "cafe 40 seats, bar, toilet"),
  suggest furniture placement + circulation. LLM proposes zones → snapped to grid.
- Validation: min circulation width, door swing clearance.

## Heavy compute
None (stays in the browser).

## Performance note
Store the layout as plain JSON (shapes + transforms) in Convex; render with Konva.
Keep furniture as reusable symbols so the same JSON can seed the 3D stage.
