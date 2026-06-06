"use client";

import { useSyncExternalStore } from "react";
import { store, dashboard, projectDetail, createProject, advanceStage, approve, startBriefing } from "./store";
import type { ProjectActions } from "./types";

function useVersion() {
  return useSyncExternalStore(store.subscribe, store.getVersion, store.getVersion);
}

export function useDashboard() {
  useVersion();
  return dashboard();
}

export function useProjectDetail(id: string) {
  useVersion();
  return projectDetail(id);
}

const actions: ProjectActions = {
  createProject: async (i) => createProject(i),
  advanceStage: async (id) => advanceStage(id),
  approve: async (id, stage, kind) => approve(id, stage, kind),
  startBriefing: async (id) => startBriefing(id),
};

export function useProjectActions(): ProjectActions {
  return actions;
}

export const MODE = "mock" as const;
