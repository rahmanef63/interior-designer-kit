// @ts-nocheck
"use client";
/**
 * Convex-backed data provider. Enabled via lib/data/index.ts.
 * @ts-nocheck because @id/convex/.../_generated only exists after `convex dev`.
 */
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@id/convex/convex/_generated/api";
import type { ProjectActions } from "./types";

export function useDashboard() {
  return useQuery(api.views.dashboard);
}

export function useProjectDetail(id: string) {
  return useQuery(api.views.projectDetail, { projectId: id });
}

export function useProjectActions(): ProjectActions {
  const create = useMutation(api.projects.createWithClient);
  const advance = useMutation(api.workflow.advanceStage);
  const approveM = useMutation(api.workflow.approve);
  const brief = useAction(api.briefing.startBriefing);
  return {
    createProject: (i) => create(i),
    advanceStage: (id) => advance({ projectId: id }),
    approve: (id, stage, kind) => approveM({ projectId: id, stage, kind }),
    startBriefing: (id) => brief({ projectId: id }),
  };
}

export const MODE = "convex";
