# Stage 15 — Handover

**PIC:** pm · **Gate out:** payment

## Goal
Hand the finished, clean project to the client.

## Outputs
`DocumentRef{kind:"bast"}` (berita acara serah terima), final documentation, warranty. Final payment (pelunasan) clears the gate.

## Tech choice
Generate BAST + warranty PDF from project data; payment via Midtrans/Xendit → `clearGate`.

## AI / automation
Auto-compile handover pack (photos + scope + warranty terms).
