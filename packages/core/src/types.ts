/**
 * Canonical domain types. These mirror the Convex schema (packages/convex)
 * and are the shapes passed around the web app and the local runner.
 */

import type { StageId, StageGate } from "./stages";
import type { RoleId } from "./roles";

export type Id = string;
export type Timestamp = number; // epoch ms

export type LeadSource = "whatsapp" | "instagram" | "website" | "referral" | "walk_in" | "other";
export type SpaceType = "rumah" | "kos" | "cafe" | "kantor" | "hotel" | "retail" | "other";
export type ProjectStatus = "lead" | "active" | "on_hold" | "won" | "lost" | "done";

export interface Client {
  _id: Id;
  name: string;
  phone?: string;
  email?: string;
  source: LeadSource;
  location?: string;
  notes?: string;
  createdAt: Timestamp;
}

export interface Project {
  _id: Id;
  code: string; // e.g. "ID-2026-014"
  title: string;
  clientId: Id;
  spaceType: SpaceType;
  areaSqm?: number;
  budgetIdr?: number;
  deadline?: Timestamp;
  status: ProjectStatus;
  currentStage: StageId;
  pic: Partial<Record<RoleId, Id>>; // assigned member per role
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type StageStatus = "not_started" | "in_progress" | "waiting_approval" | "approved" | "done";

/** Per-project, per-stage state. The gate must clear before advancing. */
export interface StageState {
  _id: Id;
  projectId: Id;
  stage: StageId;
  status: StageStatus;
  gate: StageGate;
  gateClearedAt?: Timestamp;
  assignedTo?: Id;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
}

export type ApprovalKind = "client_approval" | "internal_qc";

export interface Approval {
  _id: Id;
  projectId: Id;
  stage: StageId;
  kind: ApprovalKind;
  approvedBy?: Id; // member or client id
  approved: boolean;
  comment?: string;
  createdAt: Timestamp;
}

export type DocumentKind =
  | "brief" | "proposal" | "quotation" | "contract" | "invoice"
  | "moodboard" | "layout" | "render" | "working_drawing" | "rab"
  | "po" | "bast" | "photo" | "other";

export interface DocumentRef {
  _id: Id;
  projectId: Id;
  stage: StageId;
  kind: DocumentKind;
  name: string;
  storageId?: Id; // Convex file storage id
  url?: string;
  createdAt: Timestamp;
}

/** A single line in the RAB / Bill of Quantities. */
export interface RabLineItem {
  _id: Id;
  projectId: Id;
  category: "furniture" | "material" | "finishing" | "sipil" | "listrik" | "lighting" | "dekorasi" | "jasa" | "transport" | "lain";
  name: string;
  unit: string; // m2, pcs, lembar, set...
  qty: number;
  unitPriceIdr: number;
  total: number; // qty * unitPriceIdr (computed via lineTotal)
}

export function lineTotal(item: Pick<RabLineItem, "qty" | "unitPriceIdr">): number {
  return item.qty * item.unitPriceIdr;
}

/** BYOK record. The web app stores the user/studio AI key encrypted at rest. */
export interface AiKey {
  _id: Id;
  ownerId: Id; // user or studio
  provider: "anthropic" | "openai";
  /** Ciphertext only — never store plaintext. Decrypted server-side per request. */
  encryptedKey: string;
  label?: string;
  createdAt: Timestamp;
}
