/**
 * In-memory mock store + the workflow state machine, used by the mock data
 * provider so the app runs and is dogfoodable with zero backend. The gate /
 * advance logic mirrors packages/convex/convex/workflow.ts and reuses the
 * single source of truth in @id/core (STAGES[stage].gate, nextStage).
 */
import { STAGES, nextStage, type StageId, type ApprovalKind } from "@id/core";
import type { DashboardProject, ProjectDetailData, CreateProjectInput } from "./types";

interface Client { _id: string; name: string; phone?: string; source: string; location?: string }
interface Project {
  _id: string; code: string; title: string; clientId: string; spaceType: string;
  areaSqm?: number; budgetIdr?: number; status: string; currentStage: StageId;
  pic: { role: string; memberId: string }[]; surveyAt?: number;
}
interface StageState { projectId: string; stage: StageId; status: string; gateClearedAt?: number }
interface Brief { projectId: string; summary: string }
interface Doc { _id: string; projectId: string; stage: StageId; kind: string; name: string }
interface Member { _id: string; name: string; role: string }
interface DB { clients: Client[]; projects: Project[]; stageStates: StageState[]; briefs: Brief[]; documents: Doc[]; members: Member[] }

let idc = 0;
const uid = (p: string) => `${p}_${++idc}`;
const code = (n: number) => `ID-2026-${String(n).padStart(3, "0")}`;

const MEMBERS: Member[] = [
  { _id: "m_owner", name: "Owner", role: "owner" },
  { _id: "m_admin", name: "Admin Sari", role: "admin" },
  { _id: "m_designer", name: "Designer Dewi", role: "designer" },
  { _id: "m_surveyor", name: "Surveyor Budi", role: "surveyor" },
  { _id: "m_estimator", name: "Estimator Rian", role: "estimator" },
  { _id: "m_3d", name: "3D Artist Galih", role: "artist_3d" },
  { _id: "m_drafter", name: "Drafter Wawan", role: "drafter" },
  { _id: "m_pm", name: "PM Tono", role: "pm" },
];

function seed(): DB {
  idc = 0;
  const db: DB = { clients: [], projects: [], stageStates: [], briefs: [], documents: [], members: MEMBERS };

  const add = (
    clientName: string, title: string, spaceType: string, areaSqm: number, budgetIdr: number,
    stage: StageId, opts: { gateCleared?: boolean; designer?: boolean; brief?: string; docs?: [string, string][] } = {},
  ) => {
    const clientId = uid("c");
    db.clients.push({ _id: clientId, name: clientName, source: "whatsapp" });
    const n = db.projects.length + 1;
    const projectId = uid("p");
    db.projects.push({
      _id: projectId, code: code(n), title, clientId, spaceType, areaSqm, budgetIdr,
      status: stage === "lead" ? "lead" : "active", currentStage: stage,
      pic: opts.designer ? [{ role: "designer", memberId: "m_designer" }] : [],
    });
    db.stageStates.push({ projectId, stage, status: "in_progress", gateClearedAt: opts.gateCleared ? Date.now() : undefined });
    if (opts.brief) db.briefs.push({ projectId, summary: opts.brief });
    for (const [kind, name] of opts.docs ?? []) db.documents.push({ _id: uid("d"), projectId, stage, kind, name });
  };

  add("Bu Sari", "Renovasi rumah Japandi", "rumah", 120, 250_000_000, "lead");
  add("Pak Andre", "Cafe industrial 80m2", "cafe", 80, 150_000_000, "briefing", {
    designer: true,
    brief: "# Brief\n\nCafe industrial, 40 seat, area bar + outdoor. Prioritas: pencahayaan hangat, mudah maintenance. Timeline 3 bulan.",
    docs: [["brief", "Design Brief"]],
  });
  add("PT Maju Jaya", "Kantor startup 200m2", "kantor", 200, 400_000_000, "concept", { designer: true, docs: [["moodboard", "Moodboard v1"]] });
  add("Bu Nina", "Kos eksklusif 6 kamar", "kos", 90, 180_000_000, "design3d", { designer: true, gateCleared: false, docs: [["render", "Render kamar tipe A"]] });
  add("Pak Hadi", "Butik retail 45m2", "retail", 45, 120_000_000, "rab", { designer: true, docs: [["rab", "RAB v2"]] });
  add("Grand Hotel", "Lobby hotel", "hotel", 300, 900_000_000, "site", { designer: true });

  return db;
}

let db: DB = seed();
let version = 0;
const listeners = new Set<() => void>();
function emit() {
  version++;
  listeners.forEach((l) => l());
}

export const store = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getVersion: () => version,
  reset() {
    db = seed();
    emit();
  },
};

const nameOf = (id: string) => db.members.find((m) => m._id === id)?.name ?? "—";

export function dashboard(): DashboardProject[] {
  return db.projects
    .slice()
    .reverse()
    .map((p) => ({
      _id: p._id,
      code: p.code,
      title: p.title,
      status: p.status,
      currentStage: p.currentStage,
      spaceType: p.spaceType,
      budgetIdr: p.budgetIdr,
      clientName: db.clients.find((c) => c._id === p.clientId)?.name ?? "—",
    }));
}

export function projectDetail(projectId: string): ProjectDetailData | null {
  const p = db.projects.find((x) => x._id === projectId);
  if (!p) return null;
  const client = db.clients.find((c) => c._id === p.clientId) ?? null;
  return {
    project: { _id: p._id, code: p.code, title: p.title, status: p.status, currentStage: p.currentStage, spaceType: p.spaceType, areaSqm: p.areaSqm, budgetIdr: p.budgetIdr },
    client: client ? { name: client.name, phone: client.phone } : null,
    brief: db.briefs.find((b) => b.projectId === projectId) ?? null,
    documents: db.documents.filter((d) => d.projectId === projectId).map((d) => ({ _id: d._id, name: d.name, kind: d.kind, stage: d.stage })),
    pic: (p.pic ?? []).map((a) => ({ role: a.role as ProjectDetailData["pic"][number]["role"], name: nameOf(a.memberId) })),
  };
}

export function createProject(input: CreateProjectInput): { projectId: string } {
  const clientId = uid("c");
  db.clients.push({ _id: clientId, name: input.clientName, phone: input.phone, source: input.source });
  const n = db.projects.length + 1;
  const projectId = uid("p");
  db.projects.push({
    _id: projectId, code: code(n), title: input.title, clientId, spaceType: input.spaceType,
    areaSqm: input.areaSqm, budgetIdr: input.budgetIdr, status: "active", currentStage: "lead", pic: [],
  });
  db.stageStates.push({ projectId, stage: "lead", status: "in_progress" });
  emit();
  return { projectId };
}

function stateOf(projectId: string, stage: StageId) {
  return db.stageStates.find((s) => s.projectId === projectId && s.stage === stage);
}

export function advanceStage(projectId: string): StageId {
  const p = db.projects.find((x) => x._id === projectId);
  if (!p) throw new Error("Project tidak ditemukan");
  const gate = STAGES[p.currentStage].gate;
  const st = stateOf(projectId, p.currentStage);
  if (gate !== "none" && !st?.gateClearedAt) throw new Error(`Gate "${gate}" belum dipenuhi untuk stage "${STAGES[p.currentStage].labelId}"`);
  const next = nextStage(p.currentStage);
  if (!next) throw new Error("Sudah di stage terakhir");
  if (st) st.status = "done";
  db.stageStates.push({ projectId, stage: next, status: "in_progress" });
  p.currentStage = next;
  emit();
  return next;
}

export function approve(projectId: string, stage: StageId, _kind: ApprovalKind): void {
  const st = stateOf(projectId, stage);
  if (st) {
    st.gateClearedAt = Date.now();
    st.status = "approved";
  }
  emit();
}

export function startBriefing(projectId: string): void {
  const p = db.projects.find((x) => x._id === projectId);
  if (!p) throw new Error("Project tidak ditemukan");
  if (!db.briefs.find((b) => b.projectId === projectId)) {
    db.briefs.push({ projectId, summary: `# Design Brief (otomatis)\n\n${p.title} — ${p.spaceType}, ${p.areaSqm ?? "?"} m2. Fungsi, style, prioritas, timeline, scope disusun dari data lead.` });
    db.documents.push({ _id: uid("d"), projectId, stage: "briefing", kind: "brief", name: "Design Brief" });
  }
  if (!p.pic.find((a) => a.role === "designer")) p.pic.push({ role: "designer", memberId: "m_designer" });
  p.surveyAt = Date.now() + 2 * 24 * 60 * 60 * 1000;
  if (p.currentStage === "lead") advanceStage(projectId);
  else emit();
}
