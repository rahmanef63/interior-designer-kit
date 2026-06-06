import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { stage, role, leadSource, spaceType, projectStatus, stageStatus } from "./validators";

export default defineSchema({
  // Convex Auth tables (users, authSessions, authAccounts, ...).
  ...authTables,

  members: defineTable({
    name: v.string(),
    email: v.string(),
    role,
    active: v.boolean(),
  }).index("by_email", ["email"]),

  clients: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    source: leadSource,
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
  }),

  projects: defineTable({
    code: v.string(),
    title: v.string(),
    clientId: v.id("clients"),
    spaceType,
    areaSqm: v.optional(v.number()),
    budgetIdr: v.optional(v.number()),
    deadline: v.optional(v.number()),
    surveyAt: v.optional(v.number()),
    status: projectStatus,
    currentStage: stage,
    pic: v.optional(v.array(v.object({ role, memberId: v.id("members") }))),
  })
    .index("by_status", ["status"])
    .index("by_stage", ["currentStage"]),

  stageStates: defineTable({
    projectId: v.id("projects"),
    stage,
    status: stageStatus,
    assignedTo: v.optional(v.id("members")),
    gateClearedAt: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index("by_project", ["projectId"])
    .index("by_project_stage", ["projectId", "stage"]),

  approvals: defineTable({
    projectId: v.id("projects"),
    stage,
    kind: v.union(v.literal("client_approval"), v.literal("internal_qc")),
    approved: v.boolean(),
    approvedBy: v.optional(v.string()),
    comment: v.optional(v.string()),
  }).index("by_project", ["projectId"]),

  documents: defineTable({
    projectId: v.id("projects"),
    stage,
    kind: v.string(),
    name: v.string(),
    storageId: v.optional(v.id("_storage")),
    url: v.optional(v.string()),
  }).index("by_project", ["projectId"]),

  rabItems: defineTable({
    projectId: v.id("projects"),
    category: v.string(),
    name: v.string(),
    unit: v.string(),
    qty: v.number(),
    unitPriceIdr: v.number(),
  }).index("by_project", ["projectId"]),

  briefs: defineTable({
    projectId: v.id("projects"),
    summary: v.string(),
    fungsi: v.optional(v.string()),
    style: v.optional(v.string()),
    prioritas: v.optional(v.string()),
    timeline: v.optional(v.string()),
    scope: v.optional(v.string()),
  }).index("by_project", ["projectId"]),

  aiKeys: defineTable({
    ownerId: v.string(),
    provider: v.union(v.literal("anthropic"), v.literal("openai")),
    encryptedKey: v.string(),
    label: v.optional(v.string()),
  }).index("by_owner", ["ownerId"]),
});
