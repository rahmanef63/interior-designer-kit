"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectActions } from "@/lib/data";
import type { SpaceType } from "@id/core";

const SPACE_TYPES: SpaceType[] = ["rumah", "kos", "cafe", "kantor", "hotel", "retail", "other"];

export default function NewProjectPage() {
  const { createProject } = useProjectActions();
  const router = useRouter();
  const [f, setF] = useState({ clientName: "", phone: "", title: "", spaceType: "rumah", areaSqm: "", budgetIdr: "" });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { projectId } = await createProject({
        clientName: f.clientName,
        phone: f.phone || undefined,
        source: "walk_in",
        title: f.title,
        spaceType: f.spaceType as SpaceType,
        areaSqm: f.areaSqm ? Number(f.areaSqm) : undefined,
        budgetIdr: f.budgetIdr ? Number(f.budgetIdr) : undefined,
      });
      router.push(`/projects/${projectId}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page narrow">
      <a href="/dashboard" className="back">← Pipeline</a>
      <h1>Project baru</h1>
      <form className="form" onSubmit={submit}>
        <label>Nama klien<input value={f.clientName} onChange={set("clientName")} required /></label>
        <label>No. WhatsApp<input value={f.phone} onChange={set("phone")} placeholder="6281…" /></label>
        <label>Judul project<input value={f.title} onChange={set("title")} required placeholder="Desain cafe 80m2" /></label>
        <label>Jenis ruang
          <select value={f.spaceType} onChange={set("spaceType")}>
            {SPACE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>Luas (m²)<input type="number" value={f.areaSqm} onChange={set("areaSqm")} /></label>
        <label>Budget (Rp)<input type="number" value={f.budgetIdr} onChange={set("budgetIdr")} placeholder="150000000" /></label>
        <button className="btn" type="submit" disabled={busy || !f.clientName || !f.title}>Buat project</button>
      </form>
    </main>
  );
}
