import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { OUTPUT_DIR, ensureOutput } from "../config.mjs";

/** Save a structured lead extracted from a client message. */
export const saveLead = {
  name: "save_lead",
  description:
    "Save a structured interior-design lead extracted from a WhatsApp/Instagram message.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string" },
      source: { type: "string", enum: ["whatsapp", "instagram", "website", "referral", "walk_in", "other"] },
      spaceType: { type: "string", enum: ["rumah", "kos", "cafe", "kantor", "hotel", "retail", "other"] },
      areaSqm: { type: "number" },
      budgetIdr: { type: "number" },
      location: { type: "string" },
      needs: { type: "string" },
    },
    required: ["name"],
  },
  // Used only in --dry-run to exercise the loop without a model.
  mockInput: (input) => ({
    name: "(demo) " + (input.split(/[,.]/)[0] || "Client").trim(),
    source: "whatsapp",
    spaceType: "cafe",
    needs: input,
  }),
  run: async (data) => {
    ensureOutput();
    const file = join(OUTPUT_DIR, `lead-${Date.now()}.json`);
    writeFileSync(file, JSON.stringify(data, null, 2));
    return { saved: file };
  },
};

/** Write a text/markdown artifact (e.g. a design brief) to local output. */
export const writeOutput = {
  name: "write_output",
  description: "Write a text/markdown artifact (e.g. a design brief) to the local output folder.",
  input_schema: {
    type: "object",
    properties: {
      filename: { type: "string" },
      content: { type: "string" },
    },
    required: ["filename", "content"],
  },
  mockInput: (input) => ({ filename: "brief.md", content: "# Design Brief (demo)\n\n" + input }),
  run: async ({ filename, content }) => {
    ensureOutput();
    const file = join(OUTPUT_DIR, filename);
    writeFileSync(file, content);
    return { written: file };
  },
};
