/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _shared_auth from "../_shared/auth.js";
import type * as _shared_codes from "../_shared/codes.js";
import type * as ai from "../ai.js";
import type * as aiKeys from "../aiKeys.js";
import type * as auth from "../auth.js";
import type * as automation from "../automation.js";
import type * as briefing from "../briefing.js";
import type * as clients from "../clients.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as intake from "../intake.js";
import type * as lib_crypto from "../lib/crypto.js";
import type * as lib_whatsapp from "../lib/whatsapp.js";
import type * as members from "../members.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";
import type * as validators from "../validators.js";
import type * as views from "../views.js";
import type * as workflow from "../workflow.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_shared/auth": typeof _shared_auth;
  "_shared/codes": typeof _shared_codes;
  ai: typeof ai;
  aiKeys: typeof aiKeys;
  auth: typeof auth;
  automation: typeof automation;
  briefing: typeof briefing;
  clients: typeof clients;
  crons: typeof crons;
  http: typeof http;
  intake: typeof intake;
  "lib/crypto": typeof lib_crypto;
  "lib/whatsapp": typeof lib_whatsapp;
  members: typeof members;
  projects: typeof projects;
  seed: typeof seed;
  users: typeof users;
  validators: typeof validators;
  views: typeof views;
  workflow: typeof workflow;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
