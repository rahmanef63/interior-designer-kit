# Stage 11 — Procurement

**PIC:** admin · **Gate out:** none

## Goal
Order materials and items per the final RAB.

## Outputs
Shopping list, vendor POs, expected-arrival schedule.

## Tech choice
Convex tables (purchaseOrders, vendors). Status tracking per item.

## AI / automation
Auto-generate POs grouped by vendor from `rabItems`; price-check against past POs; alert on late arrivals (cron).
