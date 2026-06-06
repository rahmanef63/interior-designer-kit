# Best Practices — Interior Design Studio

These are tuned for this field. They follow the generator's framework:
decompose recurring work, match each task to the right Cowork capability, choose
a deployment surface, and add guardrails.

## Field-specific guidance
- **Money & client sends are approval-gated** — The agent drafts proposals, quotations, invoices, and WhatsApp replies into ./output; a human reviews and sends. Never auto-send or auto-charge.
- **Survey first** — Never draft a RAB, layout, or 3D direction without the structured survey measurements. Read the survey record/notes first; if missing, create a task to capture them.
- **Respect the 16 stage gates** — Proposal, concept, layout, 3D, and RAB advance only on client approval; contract and handover on payment. Don't mark a stage done without a recorded sign-off.
- **Per-project scoped folder** — Point Cowork at one client/project folder (./inbox + ./output), not your whole drive. Keep each project's photos, notes, and deliverables together.
- **Keep the RAB columnar** — Store BoQ line items as JSONL/CSV records (save_record), not merged-cell spreadsheets. Reconcile category subtotals and the grand total in a verification pass before sending.

## Universal checklist (applies to every automation here)
- Scope folder access: point Cowork (or the CLI workspace) at one working folder, not your whole drive.
- Keep deterministic steps in tools; keep judgement in the prompt.
- Gate irreversible or external actions (sending, paying, posting) behind explicit human approval.
- Never paste secrets/keys into prompts. The webapp uses BYOK; the CLI reads the key from `.env`.
- Add a verification step for anything high-stakes (re-read the output, check figures).
- Schedule the recurring parts (- **intake-lead** — on-demand: Stage 1: parse a new inbound inquiry, log the lead, draft a WhatsApp acknowledgment, and create a survey-scheduling task.
- **prepare-briefing** — on-demand: Stage 2: turn briefing notes into a structured design brief and set up the next steps.
- **proposal-pack** — on-demand: Stage 4 + 10: from an approved brief, draft a proposal + rough RAB for human review (approval-gated send).
- **daily-project-digest** — scheduled `0 1 * * *`: Every morning: summarize active projects by stage, flag deadlines at risk and pending approval gates, and create follow-up tasks.).
- Start with one high-frequency, low-stakes workflow; expand once it's trusted.
- Remember the research-preview limits: Chrome automation is slow; complex spreadsheets parse poorly.
