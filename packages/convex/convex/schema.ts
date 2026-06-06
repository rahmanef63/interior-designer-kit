import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { stage, role, leadSource, spaceType, projectStatus, stageStatus } from "./validators";

export default defineSchema({
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
    status: projectStatus,
    currentStage: stage,
    // Assigned member per role, e.g. { designer: "<memberId>" }.
    pic: v.optional(v.record(role, v.id("members"))),
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

  // BYOK: web users store their own AI key, encrypted at rest.
  aiKeys: defineTable({
    ownerId: v.string(), // user or studio id
    provider: v.union(v.literal("anthropic"), v.literal("openai")),
    encryptedKey: v.string(), // AES-256-GCM ciphertext (see lib/crypto.ts)
    label: v.optional(v.string()),
  }).index("by_owner", ["ownerId"]),
});
