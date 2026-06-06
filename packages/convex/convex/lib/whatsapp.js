/**
 * Send a WhatsApp text via the Meta Cloud API. Used by intake auto-reply and
 * the lead→briefing handoff. No-op (warns) if WhatsApp env isn't configured, so
 * the rest of the automation still runs in dev.
 */
export async function sendWhatsAppText(to, body) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    if (!token || !phoneId) {
        console.warn(`[whatsapp] not configured — would send to ${to}: ${body}`);
        return false;
    }
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body },
        }),
    });
    if (!res.ok)
        throw new Error(`WhatsApp send ${res.status}: ${await res.text()}`);
    return true;
}
