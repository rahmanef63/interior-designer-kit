// Per-project detail: stage tracker + documents + RAB + approvals.
// Each workflow stage renders its own module here (see docs/stages/).

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  return (
    <main className="page">
      <h1>Project {params.projectId}</h1>
      <p className="lead">
        Detail project: tracker 16-stage, dokumen per stage, RAB, dan tombol
        <code> advanceStage</code> (aktif saat gate stage terpenuhi).
      </p>
    </main>
  );
}
