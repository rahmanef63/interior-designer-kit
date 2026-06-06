"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useProjectDetail, useProjectActions } from "@/lib/data";
import { STAGE_ORDER, STAGES, ROLES, type StageId } from "@id/core";
import { formatIdr } from "@id/ui";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const data = useProjectDetail(projectId);
  const { advanceStage, approve, startBriefing } = useProjectActions();
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (data === undefined) return <main className="page"><p className="lead">Memuat…</p></main>;
  if (data === null) return <main className="page"><p className="lead">Project tidak ditemukan.</p></main>;

  const { project, client, brief, documents, pic } = data;
  const cur = STAGES[project.currentStage as StageId];

  async function run(fn: () => Promise<unknown>, ok: string) {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      setMsg(ok);
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <Link href="/dashboard" className="back">← Pipeline</Link>
      <div className="row-between">
        <div>
          <h1>{project.title}</h1>
          <p className="lead">
            {project.code} · {client?.name ?? "—"} · {project.spaceType}
            {project.budgetIdr ? ` · ${formatIdr(project.budgetIdr)}` : ""}
          </p>
        </div>
        <span className={`status status-${project.status}`}>{project.status}</span>
      </div>

      <div className="tracker">
        {STAGE_ORDER.map((id) => {
          const s = STAGES[id];
          const state = id === project.currentStage ? "current" : s.order < cur.order ? "done" : "todo";
          return <span key={id} className={`dot ${state}`} title={`${s.order}. ${s.labelId}`}>{s.order}</span>;
        })}
      </div>
      <p className="cur">
        Stage sekarang: <strong>{cur.order}. {cur.labelId}</strong> · PIC: {ROLES[cur.pic].labelId} · Gate: {cur.gate}
      </p>

      <div className="actions">
        {project.currentStage === "lead" && (
          <button className="btn" disabled={busy} onClick={() => run(() => startBriefing(projectId), "Briefing dimulai.")}>
            Mulai Briefing
          </button>
        )}
        {(cur.gate === "client_approval" || cur.gate === "internal_qc") && (
          <button
            className="btn ghost"
            disabled={busy}
            onClick={() =>
              run(
                () => approve(projectId, project.currentStage as StageId, cur.gate === "internal_qc" ? "internal_qc" : "client_approval"),
                "Gate disetujui.",
              )
            }
          >
            Setujui ({cur.gate === "internal_qc" ? "QC" : "klien"})
          </button>
        )}
        <button className="btn ghost" disabled={busy} onClick={() => run(() => advanceStage(projectId), "Lanjut ke stage berikutnya.")}>
          Lanjut →
        </button>
      </div>
      {msg && <p className="msg">{msg}</p>}

      {brief && (
        <section className="panel">
          <h2>Design Brief</h2>
          <p className="brief-body">{brief.summary}</p>
        </section>
      )}

      <section className="panel">
        <h2>Dokumen ({documents.length})</h2>
        {documents.length === 0 ? (
          <p className="lead">Belum ada dokumen.</p>
        ) : (
          <ul>
            {documents.map((d) => (
              <li key={d._id}>
                {d.name} <span className="muted">({d.kind} · {STAGES[d.stage as StageId].labelId})</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <h2>Tim (PIC)</h2>
        {pic.length === 0 ? (
          <p className="lead">Belum ada PIC ditugaskan.</p>
        ) : (
          <ul>
            {pic.map((p, i) => (
              <li key={i}>{ROLES[p.role].labelId}: {p.name}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
