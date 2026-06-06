# Stage 01 — Lead / Inquiry

**PIC:** admin · **Gate out:** none

## Goal
Capture an inbound inquiry as a structured Client + Project, ready for briefing.

## Inputs
A message from WhatsApp / Instagram / website / referral / walk-in.

## Outputs
`Client` + `Project` (status `lead`, `currentStage = lead`) + first `StageState`.

## Automation — WhatsApp → AI → Project (end-to-end)

Wired and verified. Flow:

```
WhatsApp Cloud API
   │  POST webhook
   ▼
convex/http.ts  /whatsapp/webhook
   │  extractWhatsAppMessages(body)  → [{from, text}]
   │  scheduler.runAfter(0, intake.processInbound)   (ACK Meta fast)
   ▼
convex/intake.ts  processInbound (internalAction)
   │  parseLead(text)  → Anthropic tool-use "emit_lead" → structured fields
   ▼
convex/intake.ts  createFromLead (internalMutation)
   │  insert Client + Project (code ID-YYYY-NNN) + StageState(lead)
   ▼
Project appears on the pipeline at stage 1.
```

### Setup
1. Convex deployment env: `ANTHROPIC_API_KEY` (studio system key),
   `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`.
2. In Meta, point the webhook to `https://<your-convex>.convex.site/whatsapp/webhook`
   with the same verify token.

### Notes
- Backend automation uses the **studio system key**, not per-user BYOK (no user
  in context for a webhook).
- Delivery/status webhooks (no `messages`) are ignored, so no junk projects.
- The parse uses **tool-use** (`tool_choice` forced) so output is always valid
  structured JSON, not free text.

### Next
- Add Instagram + website form as additional intake sources (same `createFromLead`).
- Auto-reply on WhatsApp + assign the admin PIC + schedule a survey.
