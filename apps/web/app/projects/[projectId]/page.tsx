// Per-project detail: stage tracker + documents + RAB + approvals.
// Each workflow stage renders its own module here (see docs/stages/).
//
// Wire the "Mulai Briefing" automation after `convex dev` generates the API:
//
//   "use client";
//   import { useAction } from "convex/react";
//   import { api } from "@id/convex/convex/_generated/api";
//
//   const startBriefing = useAction(api.briefing.startBriefing);
//   <button onClick={() => startBriefing({ projectId })}>Mulai Briefing</button>
//
// That single call generates the brief, assigns a designer, schedules the
// survey, advances lead → briefing, and notifies the client on WhatsApp.

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  return (
    <main className="page">
      <h1>Project {params.projectId}</h1>
      <p className="lead">
        Detail project: tracker 16-stage, dokumen per stage, RAB, dan aksi otomasi
        seperti <code>Mulai Briefing</code> (lead → briefing dalam satu klik).
      </p>
    </main>
  );
}
