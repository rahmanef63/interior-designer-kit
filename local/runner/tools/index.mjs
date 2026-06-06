import { saveLead, writeOutput } from "./leadTools.mjs";

/** Tool registry. Add new tools here and reference them by name in a task. */
export const ALL_TOOLS = {
  save_lead: saveLead,
  write_output: writeOutput,
};

export function pick(names) {
  return names.map((n) => ALL_TOOLS[n]).filter(Boolean);
}
