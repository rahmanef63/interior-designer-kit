# Stage 02 — Briefing

**PIC:** designer · **Gate out:** none

## Goal
Turn a qualified lead into a design brief, with the team assigned and a survey
scheduled — ready for Stage 3.

## Inputs
The lead `Project` (from Stage 1 intake) + its `Client`.

## Outputs
`briefs` row (structured + markdown) + `DocumentRef{kind:"brief"}`,
`project.pic.designer` set, `project.surveyAt` set, stage advanced to `briefing`.

## Automation — lead → briefing handoff (verified)

Two triggers:

**a) On intake (immediate):** `intake.processInbound` sends a WhatsApp
auto-reply acknowledging the inquiry (`lib/whatsapp.ts`).

**b) Admin clicks "Mulai Briefing":** `briefing.startBriefing(projectId)` runs:

```
startBriefing (action)
  1. generateBriefText()        AI (studio key, tool-use "emit_brief") → structured brief
  2. saveBrief                  briefs row + documents{kind:"brief"}
  3. autoAssignPic("designer")  first active designer → project.pic.designer
  4. scheduleSurvey(+2 days)    project.surveyAt
  5. advanceStage               lead → briefing (gate "none")
  6. sendWhatsAppText           notify client: brief ready, team assigned, survey slot
```

### Setup
- Seed a team so auto-assign has a target: `npx convex run seed:run`.
- WhatsApp + `ANTHROPIC_API_KEY` (studio key) in the Convex deployment env.
  Without WhatsApp configured, sends are skipped (logged), the rest still runs.

### Verified logic
WA payload shape, designer selection (skips inactive / null when none), survey
date (+2d → WIB), and the 6-step order — all unit-checked.

### Next
- Let the client pick/confirm the survey slot via WhatsApp reply (2-way).
- Add a calendar event for the surveyor (Google Calendar connector).
