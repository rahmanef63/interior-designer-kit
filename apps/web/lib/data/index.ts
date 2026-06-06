/**
 * Data layer — auto-selects backend.
 *
 * - NEXT_PUBLIC_CONVEX_URL set  -> Convex (real backend + auth).
 * - not set                     -> in-memory mock (offline dogfood, zero config).
 *
 * This keys on the SAME env var as app/providers.tsx, so the data source and the
 * Convex provider can never disagree (that mismatch was the "missing ConvexProvider"
 * crash). Pages only import from "@/lib/data".
 */
import * as mock from "./mock";
import * as convex from "./convexApi";

const P = process.env.NEXT_PUBLIC_CONVEX_URL ? convex : mock;

export const useDashboard = P.useDashboard;
export const useProjectDetail = P.useProjectDetail;
export const useProjectActions = P.useProjectActions;
export const DATA_MODE: string = P.MODE;

export type { DashboardProject, ProjectDetailData, CreateProjectInput, ProjectActions } from "./types";
