"use client";

import { useState } from "react";
// After `convex dev` generates the API, wire these up:
// import { useAction } from "convex/react";
// import { api } from "@id/convex/convex/_generated/api";

export default function SettingsPage() {
  const [provider, setProvider] = useState<"anthropic" | "openai">("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  // const store = useAction(api.aiKeys.store);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    // await store({ ownerId: currentStudioId, provider, apiKey });
    // The key is encrypted server-side (KEY_VAULT_SECRET) before storage.
    setSaved(true);
    setApiKey("");
  }

  return (
    <main className="page narrow">
      <h1>API Key (BYOK)</h1>
      <p className="lead">
        Web app pakai key milikmu sendiri. Key dienkripsi di server (AES-256-GCM)
        sebelum disimpan — plaintext tidak pernah masuk database.
      </p>

      <form className="form" onSubmit={onSave}>
        <label>
          Provider
          <select value={provider} onChange={(e) => setProvider(e.target.value as "anthropic" | "openai")}>
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="openai">OpenAI</option>
          </select>
        </label>

        <label>
          API Key
          <input
            type="password"
            placeholder={provider === "anthropic" ? "sk-ant-..." : "sk-..."}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            autoComplete="off"
          />
        </label>

        <button className="btn" type="submit" disabled={!apiKey}>Simpan</button>
        {saved && <p className="ok">Tersimpan. (Sambungkan ke <code>api.aiKeys.store</code> setelah <code>convex dev</code>.)</p>}
      </form>
    </main>
  );
}
