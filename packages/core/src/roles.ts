/**
 * PIC roles for a studio team + a capability-based permission model.
 * Stages reference these roles (see stages.ts). The web app and Convex
 * both enforce permissions through `can()`.
 */

export const ROLE_IDS = [
  "owner",
  "admin", // Admin / Sales
  "designer",
  "surveyor",
  "estimator",
  "artist_3d",
  "drafter",
  "pm", // Project Manager
  "workshop",
  "site_team",
  "client", // limited client-portal access
] as const;

export type RoleId = (typeof ROLE_IDS)[number];

export interface RoleDef {
  id: RoleId;
  label: string; // English
  labelId: string; // Bahasa Indonesia
  /** Can this role see the client-facing portal only (vs. internal app)? */
  clientFacing: boolean;
}

export const ROLES: Record<RoleId, RoleDef> = {
  owner: { id: "owner", label: "Owner", labelId: "Owner", clientFacing: false },
  admin: { id: "admin", label: "Admin / Sales", labelId: "Admin / Sales", clientFacing: false },
  designer: { id: "designer", label: "Designer", labelId: "Desainer", clientFacing: false },
  surveyor: { id: "surveyor", label: "Surveyor", labelId: "Surveyor", clientFacing: false },
  estimator: { id: "estimator", label: "Estimator", labelId: "Estimator", clientFacing: false },
  artist_3d: { id: "artist_3d", label: "3D Artist", labelId: "3D Artist", clientFacing: false },
  drafter: { id: "drafter", label: "Drafter", labelId: "Drafter", clientFacing: false },
  pm: { id: "pm", label: "Project Manager", labelId: "Project Manager", clientFacing: false },
  workshop: { id: "workshop", label: "Workshop", labelId: "Workshop", clientFacing: false },
  site_team: { id: "site_team", label: "Site Team", labelId: "Tim Lapangan", clientFacing: false },
  client: { id: "client", label: "Client", labelId: "Klien", clientFacing: true },
};

export type Capability =
  | "manage_users"
  | "manage_billing"
  | "view_finance"
  | "approve_stage"
  | "edit_project"
  | "view_project"
  | "use_ai";

/** Capability grant per role. Keep this as the single source of truth. */
export const ROLE_CAPABILITIES: Record<RoleId, Capability[]> = {
  owner: ["manage_users", "manage_billing", "view_finance", "approve_stage", "edit_project", "view_project", "use_ai"],
  admin: ["view_finance", "approve_stage", "edit_project", "view_project", "use_ai"],
  designer: ["edit_project", "view_project", "use_ai"],
  surveyor: ["edit_project", "view_project", "use_ai"],
  estimator: ["view_finance", "edit_project", "view_project", "use_ai"],
  artist_3d: ["edit_project", "view_project", "use_ai"],
  drafter: ["edit_project", "view_project", "use_ai"],
  pm: ["approve_stage", "edit_project", "view_project", "use_ai"],
  workshop: ["edit_project", "view_project"],
  site_team: ["edit_project", "view_project"],
  client: ["view_project"],
};

export function can(role: RoleId, cap: Capability): boolean {
  return ROLE_CAPABILITIES[role]?.includes(cap) ?? false;
}
