import { STAGES, STAGE_ORDER, ROLES } from "@id/core";

const gateLabel: Record<string, string> = {
  none: "—",
  client_approval: "Approval klien",
  payment: "Pembayaran",
  internal_qc: "QC internal",
};

export default function DashboardPage() {
  return (
    <main className="page">
      <h1>Pipeline</h1>
      <p className="lead">16 tahap workflow. Tiap kolom = satu stage dengan PIC, output, dan gate.</p>

      <div className="board">
        {STAGE_ORDER.map((id) => {
          const s = STAGES[id];
          return (
            <section key={id} className="col">
              <header className="col-head">
                <span className="order">{s.order}</span>
                <span className="title">{s.labelId}</span>
              </header>
              <p className="pic">PIC: <strong>{ROLES[s.pic].labelId}</strong></p>
              <ul className="outputs">
                {s.outputs.map((o) => <li key={o}>{o}</li>)}
              </ul>
              <footer className={`gate gate-${s.gate}`}>Gate: {gateLabel[s.gate]}</footer>
            </section>
          );
        })}
      </div>
    </main>
  );
}
