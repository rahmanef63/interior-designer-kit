/**
 * The 16-stage interior design workflow as a state machine.
 *
 * One Project flows through these stages in order. Each stage has a primary
 * PIC (role), expected outputs, and a `gate` that must be satisfied before the
 * project can advance. This is the "spine" every feature module plugs into.
 */

import type { RoleId } from "./roles";

export const STAGE_IDS = [
  "lead", // 1. Lead / Inquiry
  "briefing", // 2. Briefing Awal
  "survey", // 3. Survey Lokasi
  "proposal", // 4. Proposal & Penawaran
  "contract", // 5. Kontrak & DP
  "concept", // 6. Konsep Desain
  "layout", // 7. Layout & Space Planning
  "design3d", // 8. 3D Design / Visualisasi
  "working_drawing", // 9. Gambar Kerja
  "rab", // 10. RAB Final
  "procurement", // 11. Procurement / Belanja
  "production", // 12. Produksi Workshop
  "site", // 13. Pekerjaan Site / Instalasi
  "qc", // 14. Quality Control
  "handover", // 15. Handover / Serah Terima
  "after_sales", // 16. After Sales
] as const;

export type StageId = (typeof STAGE_IDS)[number];

/** What unblocks the transition OUT of a stage. */
export type StageGate =
  | "none"
  | "client_approval" // client must approve the output
  | "payment" // an invoice/termin must be paid
  | "internal_qc"; // internal sign-off before advancing

export interface StageDef {
  id: StageId;
  order: number; // 1..16
  label: string; // English
  labelId: string; // Bahasa Indonesia
  pic: RoleId; // primary responsible role
  outputs: string[]; // key deliverables produced in this stage
  gate: StageGate;
}

export const STAGES: Record<StageId, StageDef> = {
  lead: {
    id: "lead", order: 1, label: "Lead / Inquiry", labelId: "Lead / Inquiry",
    pic: "admin", gate: "none",
    outputs: ["Data awal client", "Jadwal meeting / survey"],
  },
  briefing: {
    id: "briefing", order: 2, label: "Briefing", labelId: "Briefing Awal",
    pic: "designer", gate: "none",
    outputs: ["Design brief", "Scope awal", "Estimasi kasar"],
  },
  survey: {
    id: "survey", order: 3, label: "Site Survey", labelId: "Survey Lokasi",
    pic: "surveyor", gate: "none",
    outputs: ["Data ukuran existing", "Dokumentasi lokasi", "Catatan teknis"],
  },
  proposal: {
    id: "proposal", order: 4, label: "Proposal & Quotation", labelId: "Proposal & Penawaran",
    pic: "estimator", gate: "client_approval",
    outputs: ["Proposal project", "Quotation / RAB awal"],
  },
  contract: {
    id: "contract", order: 5, label: "Contract & Down Payment", labelId: "Kontrak & DP",
    pic: "admin", gate: "payment",
    outputs: ["Kontrak kerja", "Invoice DP"],
  },
  concept: {
    id: "concept", order: 6, label: "Concept Design", labelId: "Konsep Desain",
    pic: "designer", gate: "client_approval",
    outputs: ["Moodboard", "Color palette", "Material & furniture reference", "Style direction"],
  },
  layout: {
    id: "layout", order: 7, label: "Layout & Space Planning", labelId: "Layout & Space Planning",
    pic: "designer", gate: "client_approval",
    outputs: ["Denah layout baru", "Zonasi ruang", "Flow aktivitas"],
  },
  design3d: {
    id: "design3d", order: 8, label: "3D Design / Visualization", labelId: "3D Design / Visualisasi",
    pic: "artist_3d", gate: "client_approval",
    outputs: ["Render final", "Alternatif material"],
  },
  working_drawing: {
    id: "working_drawing", order: 9, label: "Working Drawings", labelId: "Gambar Kerja",
    pic: "drafter", gate: "internal_qc",
    outputs: ["Drawing for production", "Drawing for site team", "Detail furniture custom"],
  },
  rab: {
    id: "rab", order: 10, label: "Final BoQ / RAB", labelId: "RAB Final",
    pic: "estimator", gate: "client_approval",
    outputs: ["RAB final", "Approval produksi"],
  },
  procurement: {
    id: "procurement", order: 11, label: "Procurement", labelId: "Procurement / Belanja Material",
    pic: "admin", gate: "none",
    outputs: ["List belanja", "PO vendor", "Jadwal kedatangan barang"],
  },
  production: {
    id: "production", order: 12, label: "Workshop Production", labelId: "Produksi Workshop",
    pic: "workshop", gate: "internal_qc",
    outputs: ["Furniture siap kirim", "QC sebelum instalasi"],
  },
  site: {
    id: "site", order: 13, label: "Site Work / Installation", labelId: "Pekerjaan Site / Instalasi",
    pic: "site_team", gate: "none",
    outputs: ["Progress lapangan", "Update harian / mingguan"],
  },
  qc: {
    id: "qc", order: 14, label: "Quality Control", labelId: "Quality Control",
    pic: "pm", gate: "internal_qc",
    outputs: ["Punch list", "List revisi minor"],
  },
  handover: {
    id: "handover", order: 15, label: "Handover", labelId: "Handover / Serah Terima",
    pic: "pm", gate: "payment",
    outputs: ["Berita acara serah terima", "Dokumentasi final", "Garansi"],
  },
  after_sales: {
    id: "after_sales", order: 16, label: "After Sales", labelId: "After Sales",
    pic: "admin", gate: "none",
    outputs: ["Follow up", "Garansi minor defect", "Review client", "Dokumentasi portfolio"],
  },
};

/** Stage ids in workflow order. */
export const STAGE_ORDER: readonly StageId[] = STAGE_IDS;

export function stageDef(id: StageId): StageDef {
  return STAGES[id];
}

export function nextStage(id: StageId): StageId | null {
  const i = STAGE_ORDER.indexOf(id);
  return i >= 0 && i < STAGE_ORDER.length - 1 ? STAGE_ORDER[i + 1]! : null;
}

export function prevStage(id: StageId): StageId | null {
  const i = STAGE_ORDER.indexOf(id);
  return i > 0 ? STAGE_ORDER[i - 1]! : null;
}

/** Percent complete (1..16 → 0..100) for dashboards. */
export function stageProgress(id: StageId): number {
  return Math.round((STAGES[id].order / STAGE_ORDER.length) * 100);
}
