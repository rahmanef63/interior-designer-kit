import { loadEnv } from "./config.mjs";

const env = loadEnv();

async function callAnthropic({ system, tools, messages }) {
  const key = env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY not set in local/.env");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      tools,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  return res.json();
}

/** Stub model turn for --dry-run: proposes one tool call so the loop runs offline. */
function mockResponse(tools, input) {
  const first = tools[0];
  return {
    content: [
      { type: "text", text: "[dry-run] proposing a tool call" },
      {
        type: "tool_use",
        id: "mock_1",
        name: first.name,
        input: first.mockInput ? first.mockInput(input) : { raw: input },
      },
    ],
  };
}

/**
 * Generic function-calling loop. The model decides which tools to call;
 * we execute them locally and feed results back until it stops.
 */
export async function runAgent({ system, tools, input, dryRun }) {
  const messages = [{ role: "user", content: input }];
  const toolDefs = tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema,
  }));

  for (let step = 0; step < 6; step++) {
    const response = dryRun
      ? mockResponse(tools, input)
      : await callAnthropic({ system, tools: toolDefs, messages });

    const content = response.content || [];
    const toolUses = content.filter((c) => c.type === "tool_use");

    if (toolUses.length === 0) {
      return content.filter((c) => c.type === "text").map((c) => c.text).join("") || "[no output]";
    }

    const results = [];
    for (const tu of toolUses) {
      const tool = tools.find((t) => t.name === tu.name);
      const out = tool ? await tool.run(tu.input) : { error: `unknown tool ${tu.name}` };
      console.log(`  ↳ ${tu.name}(${JSON.stringify(tu.input)}) → ${JSON.stringify(out)}`);
      results.push({ type: "tool_result", tool_use_id: tu.id, content: JSON.stringify(out) });
    }

    if (dryRun) return `[dry-run] executed: ${toolUses.map((t) => t.name).join(", ")}`;

    messages.push({ role: "assistant", content });
    messages.push({ role: "user", content: results });
  }
  return "[max steps reached]";
}
