# Stage 05 — Contract & Down Payment

**PIC:** admin · **Gate out:** payment

## Goal
Sign the contract and collect the DP to formally start the project.

## Outputs
`DocumentRef{kind:"contract"}` + `{kind:"invoice"}`. Payment clears the gate.

## Tech choice
E-signature (e.g. third-party); payment via **Midtrans/Xendit**. Their webhook calls `workflow.clearGate(projectId, "contract")`.

## AI / automation
Generate the contract from a template (scope/price/termin from the approved proposal).
