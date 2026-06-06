// Project list. Wire to Convex after `convex dev`:
//   "use client";
//   import { useQuery } from "convex/react";
//   import { api } from "@id/convex/convex/_generated/api";
//   const projects = useQuery(api.projects.list);

export default function ProjectsPage() {
  return (
    <main className="page">
      <h1>Projects</h1>
      <p className="lead">
        Daftar project akan tampil di sini dari <code>api.projects.list</code>.
        Tiap project membawa <code>currentStage</code> dan PIC-nya.
      </p>
    </main>
  );
}
