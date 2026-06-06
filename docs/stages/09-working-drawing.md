# Stage 09 — Working Drawings

**PIC:** drafter · **Gate out:** internal_qc

## Goal
Technical drawings for production and the site team.

## Outputs
`DocumentRef{kind:"working_drawing"}`: denah, plafon, titik lampu/listrik, tampak, detail furniture.

## Tech choice — `services/cad` (ezdxf)
Generate DXF from the layout/3D model. Web shows a viewer + markup.

## AI / automation
Auto-generate denah + titik (lampu/listrik) from the model; drafter refines. Internal QC sign-off clears the gate.

## Heavy compute
`services/cad` (Python ezdxf) — never on Vercel.
