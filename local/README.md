# Local runner (Windows hybrid)

Run AI **function-calling** locally with a `.bat` and your own key — no web app
needed. Same workflow as the web app, but the key lives in `local/.env` (BYOK)
and outputs are written to `local/output/`.

## Setup

1. Install Node 20+.
2. `copy local\.env.example local\.env` and put your key in it.

## Use

```bat
REM Try it without a key (stub model response, exercises the tool loop):
local\scripts\lead-parse.bat "Bu Sari, butuh desain cafe 80m2 budget 150jt di Bandung" --dry-run

REM Real run (needs ANTHROPIC_API_KEY in local/.env):
local\scripts\lead-parse.bat "Bu Sari, butuh desain cafe 80m2 budget 150jt di Bandung"

REM Generic:
local\scripts\run.bat brief "Klien mau ruang tamu japandi, budget 80jt, deadline 2 bulan"
```

Output JSON/markdown lands in `local/output/`.

## How it works

`scripts/*.bat` → `runner/index.mjs` (task = system prompt + allowed tools) →
`runner/agent.mjs` (the function-calling loop) → `runner/tools/*` (executed
locally). Add a tool in `runner/tools/`, register it in `tools/index.mjs`, then
reference it from a task in `index.mjs`.

This is the **local** path. The **web** path does the same thing through Convex
(`packages/convex/convex/ai.ts`) with the key pulled from the encrypted vault.
Heavy compute (CAD, render, takeoff) is delegated to `/services`, not run here.
