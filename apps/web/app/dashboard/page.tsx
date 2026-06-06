"use client";

import Link from "next/link";
import { useDashboard } from "@/lib/data";
import { STAGE_ORDER, STAGES } from "@id/core";

export default function DashboardPage() {
  const projects = useDashboard();
  const loading = projects === undefined;

  return (
    <main className="page">
      <div className="row-between">
        <div>
          <h1>Pipeline</h1>
          <p className="lead">{loading ? "Memuat…" : `${projects.length} project`} · 16 tahap</p>
        </div>
        <Link className="btn" href="/projects/new">+ Project</Link>
      </div>

      <div className="board">
        {STAGE_ORDER.map((id) => {
          const s = STAGES[id];
          const items = (projects ?? []).filter((p) => p.currentStage === id);
          return (
            <section key={id} className="col">
              <header className="col-head">
                <span className="order">{s.order}</span>
                <span className="title">{s.labelId}</span>
                {items.length > 0 && <span className="count">{items.length}</span>}
              </header>
              {items.map((p) => (
                <Link key={p._id} className="card" href={`/projects/${p._id}`}>
                  <div className="card-title">{p.title}</div>
                  <div className="card-sub">{p.code} · {p.clientName}</div>
                </Link>
              ))}
            </section>
          );
        })}
      </div>
    </main>
  );
}
