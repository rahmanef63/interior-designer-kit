#!/usr/bin/env node
import { runAgent } from "./agent.mjs";
import { pick } from "./tools/index.mjs";

/** Each task = a system prompt + the tools the model may call. */
const TASKS = {
  "lead-parse": {
    desc: "Ekstrak data lead terstruktur dari pesan WA/IG, simpan JSON.",
    system:
      "You are an intake assistant for an Indonesian interior design studio. " +
      "Extract structured lead data from the client's message and call save_lead. " +
      "Infer spaceType and budgetIdr (in rupiah) when possible.",
    tools: ["save_lead"],
  },
  brief: {
    desc: "Ubah catatan diskusi jadi design brief ringkas (markdown).",
    system:
      "You convert a client conversation into a concise interior design brief in " +
      "Bahasa Indonesia (fungsi ruang, style, prioritas, budget, timeline, scope). " +
      "Then call write_output with filename 'brief.md'.",
    tools: ["write_output"],
  },
};

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const [command, ...rest] = argv.filter((a) => a !== "--dry-run");
const input = rest.join(" ");

function usage() {
  console.log(`Interior Studio — local runner (function calling, BYOK via local/.env)

Usage:
  node index.mjs <task> "<input>" [--dry-run]

Tasks:
${Object.entries(TASKS).map(([k, v]) => `  ${k.padEnd(12)} ${v.desc}`).join("\n")}

--dry-run runs the tool loop with a stub model response (no API key needed).`);
}

if (!command || command === "help") {
  usage();
  process.exit(command ? 0 : 1);
}

const task = TASKS[command];
if (!task) {
  console.error(`Unknown task: ${command}\n`);
  usage();
  process.exit(1);
}
if (!input) {
  console.error(
    `Provide input text. Example:\n  node index.mjs ${command} "Bu Sari, butuh desain cafe 80m2 budget 150jt di Bandung"`,
  );
  process.exit(1);
}

console.log(`▶ ${command}${dryRun ? " (dry-run)" : ""}`);
const out = await runAgent({ system: task.system, tools: pick(task.tools), input, dryRun });
console.log(out);
