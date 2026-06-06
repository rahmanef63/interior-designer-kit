# Using Interior Design Studio inside Cowork

Cowork is the fastest way to *run* these automations interactively.

## 1. Give Cowork the folder
Put this repo (or just your working files) in a folder and grant Cowork access to
it. The agent reads from `./inbox` and writes deliverables to `./output`.

## 2. Install the drop-in skill
This repo ships a Cowork skill at `.cowork/skills/interior-design-ops/SKILL.md`.
Copy that folder into your Cowork/Claude skills directory so Claude loads the
domain workflows automatically.

## 3. Connect suggested connectors (MCP)
Enable these in Cowork → Settings → Connectors:
  - whatsapp
  - google-drive
  - google-calendar
  - gmail

If a connector for your tool isn't available yet, Cowork can fall back to the
Chrome extension for web tasks (slower, screenshot-based).

## 4. Schedule the recurring work
Create scheduled tasks for:
  - `0 1 * * *` → daily-project-digest: Every morning: summarize active projects by stage, flag deadlines at risk and pending approval gates, and create follow-up tasks.

## 5. Guardrails
Keep external/irreversible actions human-approved. Review the agent's plan in the
progress sidebar before letting it act on anything that leaves your machine.

## External MCP connectors (CLI `agent` engine)

`automation.config.json` may include an optional `mcpServers` map. The local
`agent` engine loads these alongside the in-process `automation` server, so the
agent can call real connectors headlessly. Shapes:

```jsonc
"mcpServers": {
  "filesystem": { "type": "stdio", "command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "."] },
  "notion":     { "type": "http",  "url": "https://mcp.notion.com/mcp", "headers": { "Authorization": "Bearer <token>" } }
}
```

- stdio: `{type:"stdio", command, args, env}` · sse/http: `{type:"sse"|"http", url, headers}`.
- The `direct` engine ignores `mcpServers` (plain tool loop).
- The Cowork surface uses connectors you enable in the Cowork app (see `suggestedConnectors`).
- Run with: `automation run "..." --engine agent`.
