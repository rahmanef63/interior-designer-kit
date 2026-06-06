import type { StageId, RoleId, ApprovalKind, SpaceType, LeadSource } from "@id/core";

export interface DashboardProject {
  _id: string;
  code: string;
  title: string;
  status: string;
  currentStage: StageId;
  spaceType: string;
  budgetIdr?: number;
  clientName: string;
}

export interface ProjectDetailData {
  project: {
    _id: string;
    code: string;
    title: string;
    status: string;
    currentStage: StageId;
    spaceType: string;
    areaSqm?: number;
    budgetIdr?: number;
  };
  client: { name: string; phone?: string } | null;
  brief: { summary: string } | null;
  documents: { _id: string; name: string; kind: string; stage: StageId }[];
  pic: { role: RoleId; name: string }[];
}

export interface CreateProjectInput {
  clientName: string;
  phone?: string;
  source: LeadSource;
  title: string;
  spaceType: SpaceType;
  areaSqm?: number;
  budgetIdr?: number;
}

export interface ProjectActions {
  createProject(input: CreateProjectInput): Promise<{ projectId: string }>;
  advanceStage(projectId: string): Promise<unknown>;
  approve(projectId: string, stage: StageId, kind: ApprovalKind): Promise<unknown>;
  startBriefing(projectId: string): Promise<unknown>;
}
