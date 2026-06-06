/**
 * Data layer — one switch between mock and Convex.
 *
 * CURRENTLY: Convex (real backend + auth).
 * To go back to offline mock dogfood: comment the two `convex` lines,
 * uncomment the two `mock` lines.
 */
// import * as mock from "./mock";
import * as convex from "./convexApi";

// const P = mock;
const P = convex;

export const useDashboard = P.useDashboard;
export const useProjectDetail = P.useProjectDetail;
export const useProjectActions = P.useProjectActions;
export const DATA_MODE: string = P.MODE;

export type { DashboardProject, ProjectDetailData, CreateProjectInput, ProjectActions } from "./types";
