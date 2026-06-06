# Stage 06 — Concept Design

**PIC:** designer · **Gate out:** client_approval

## Goal
Set visual direction: moodboard, color palette, material + furniture references.

## Outputs
`DocumentRef{kind:"moodboard"}`, palette, style direction. Client approval clears the gate.

## Tech choice
Image board (Konva or CSS grid) in the web app. Palette extraction client-side.

## AI / automation
AI image generation for concept boards (Fal/Replicate, GPU) and reference curation; extract palette from chosen images.

## Heavy compute
AI image gen → `services/render`-style GPU provider.
