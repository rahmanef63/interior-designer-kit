import Link from "next/link";
import { STAGE_ORDER } from "@id/core";

export default function Home() {
  return (
    <main className="page hero">
      <h1>Interior Studio</h1>
      <p className="lead">
        Alur kerja interior design dari lead sampai handover — {STAGE_ORDER.length} tahap,
        diperkuat AI (BYOK). Local runner untuk Windows, web app untuk tim.
      </p>
      <div className="cta">
        <Link className="btn" href="/dashboard">Buka Pipeline →</Link>
        <Link className="btn ghost" href="/settings">Atur API Key (BYOK)</Link>
      </div>
    </main>
  );
}
