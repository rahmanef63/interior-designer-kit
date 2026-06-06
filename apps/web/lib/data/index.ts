/**
 * Data layer — one switch between mock and Convex.
 *
 * DEFAULT: mock. Runs with ZERO backend — ideal for dogfooding and tests.
 *
 * TO USE CONVEX:
 *   1. `pnpm --filter @id/convex dev`   (generates convex/_generated)
 *   2. comment the two `mock` lines, uncomment the two `convex` lines below.
 *
 * Pages only import from "@/lib/data" — never from Convex directly — so the rest
 * of the app is identical in both modes.
 */
import * as mock from "./mock";
// import * as convex from "./convexApi";

const P = mock;
// const P = convex;

export const useDashboard = P.useDashboard;
export const useProjectDetail = P.useProjectDetail;
export const useProjectActions = P.useProjectActions;
export const DATA_MODE: string = P.MODE;

export type { DashboardProject, ProjectDetailData, CreateProjectInput, ProjectActions } from "./types";
