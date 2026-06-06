# Stage 04 — Proposal & Quotation

**PIC:** estimator · **Gate out:** client_approval

## Goal
Turn the brief + survey into a proposal with rough pricing and timeline.

## Outputs
`DocumentRef{kind:"proposal"}` + `{kind:"quotation"}`, client approval clears the gate.

## Tech choice
Server-side PDF/doc generation from a template. Pricing seeded from a rate library + similar past projects.

## AI / automation
Draft scope + ballpark price from the brief; estimator reviews. On approval → advance.
