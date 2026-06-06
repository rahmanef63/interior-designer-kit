/**
 * Canonical domain types. These mirror the Convex schema (packages/convex)
 * and are the shapes passed around the web app and the local runner.
 */

import type { StageId, StageGate } from "./stages";
import type { RoleId } from "./roles";

export type Id = string;
export type Timestamp = number;

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

export interface PicAssignment {
  role: RoleId;
  memberId: Id;
}

export interface Project {
  _id: Id;
  code: string;
  title: string;
  clientId: Id;
  spaceType: SpaceType;
  areaSqm?: number;
  budgetIdr?: number;
  deadline?: Timestamp;
  surveyAt?: Timestamp;
  status: ProjectStatus;
  currentStage: StageId;
  pic?: PicAssignment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type StageStatus = "not_started" | "in_progress" | "waiting_approval" | "approved" | "done";

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
  approvedBy?: Id;
  approved: boolean;
  comment?: string;
  createdAt: Timestamp;
}

export type DocumentKind =
  | "brief"
  | "proposal"
  | "quotation"
  | "contract"
  | "invoice"
  | "moodboard"
  | "layout"
  | "render"
  | "working_drawing"
  | "rab"
  | "po"
  | "bast"
  | "photo"
  | "other";

export interface DocumentRef {
  _id: Id;
  projectId: Id;
  stage: StageId;
  kind: DocumentKind;
  name: string;
  storageId?: Id;
  url?: string;
  createdAt: Timestamp;
}

export type RabCategory =
  | "furniture"
  | "material"
  | "finishing"
  | "sipil"
  | "listrik"
  | "lighting"
  | "dekorasi"
  | "jasa"
  | "transport"
  | "lain";

export interface RabLineItem {
  _id: Id;
  projectId: Id;
  category: RabCategory;
  name: string;
  unit: string;
  qty: number;
  unitPriceIdr: number;
  total: number;
}

export function lineTotal(item: Pick<RabLineItem, "qty" | "unitPriceIdr">): number {
  return item.qty * item.unitPriceIdr;
}

export interface AiKey {
  _id: Id;
  ownerId: Id;
  provider: "anthropic" | "openai";
  encryptedKey: string;
  label?: string;
  createdAt: Timestamp;
}
