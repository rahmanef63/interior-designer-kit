"use client";

import { useDashboard } from "@/lib/data";
import { STAGES, type StageId } from "@id/core";
import { formatIdr } from "@id/ui";

export default function ProjectsPage() {
  const projects = useDashboard();
  if (projects === undefined) return <main className="page"><p className="lead">Memuat…</p></main>;

  return (
    <main className="page">
      <div className="row-between">
        <h1>Projects</h1>
        <a className="btn" href="/projects/new">+ Project</a>
      </div>
      {projects.length === 0 ? (
        <p className="lead">Belum ada project. Buat yang pertama.</p>
      ) : (
        <table className="tbl">
          <thead>
            <tr><th>Kode</th><th>Judul</th><th>Klien</th><th>Stage</th><th>Budget</th></tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} onClick={() => location.assign(`/projects/${p._id}`)}>
                <td>{p.code}</td>
                <td>{p.title}</td>
                <td>{p.clientName}</td>
                <td>{STAGES[p.currentStage as StageId].labelId}</td>
                <td>{p.budgetIdr ? formatIdr(p.budgetIdr) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
