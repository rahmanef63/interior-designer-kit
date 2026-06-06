/** HTTP endpoints. WhatsApp Cloud API webhook → lead intake automation. */
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

/** Pull text messages out of a Meta WhatsApp Cloud API webhook payload. */
export function extractWhatsAppMessages(body: unknown): Array<{ from: string; text: string }> {
  const out: Array<{ from: string; text: string }> = [];
  const entries = (body as any)?.entry ?? [];
  for (const entry of entries) {
    for (const change of entry?.changes ?? []) {
      for (const m of change?.value?.messages ?? []) {
        if (m?.type === "text" && m?.text?.body) {
          out.push({ from: String(m.from ?? ""), text: String(m.text.body) });
        }
      }
    }
  }
  return out;
}

const http = httpRouter();

// 1. Meta webhook verification (GET).
http.route({
  path: "/whatsapp/webhook",
  method: "GET",
  handler: httpAction(async (_ctx, req) => {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return new Response(challenge ?? "", { status: 200 });
    }
    return new Response("forbidden", { status: 403 });
  }),
});

// 2. Inbound messages (POST) → process each as a lead.
http.route({
  path: "/whatsapp/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    for (const msg of extractWhatsAppMessages(body)) {
      // Fire-and-forget so we ACK Meta fast (it retries on non-200).
      await ctx.scheduler.runAfter(0, internal.intake.processInbound, msg);
    }
    return new Response("ok", { status: 200 });
  }),
});

export default http;
