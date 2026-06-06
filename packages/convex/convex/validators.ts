/** Shared Convex validators. Mirror the unions in @id/core. */
import { v } from "convex/values";

export const stage = v.union(
  v.literal("lead"), v.literal("briefing"), v.literal("survey"), v.literal("proposal"),
  v.literal("contract"), v.literal("concept"), v.literal("layout"), v.literal("design3d"),
  v.literal("working_drawing"), v.literal("rab"), v.literal("procurement"), v.literal("production"),
  v.literal("site"), v.literal("qc"), v.literal("handover"), v.literal("after_sales"),
);

export const role = v.union(
  v.literal("owner"), v.literal("admin"), v.literal("designer"), v.literal("surveyor"),
  v.literal("estimator"), v.literal("artist_3d"), v.literal("drafter"), v.literal("pm"),
  v.literal("workshop"), v.literal("site_team"), v.literal("client"),
);

export const leadSource = v.union(
  v.literal("whatsapp"), v.literal("instagram"), v.literal("website"),
  v.literal("referral"), v.literal("walk_in"), v.literal("other"),
);

export const spaceType = v.union(
  v.literal("rumah"), v.literal("kos"), v.literal("cafe"), v.literal("kantor"),
  v.literal("hotel"), v.literal("retail"), v.literal("other"),
);

export const projectStatus = v.union(
  v.literal("lead"), v.literal("active"), v.literal("on_hold"),
  v.literal("won"), v.literal("lost"), v.literal("done"),
);

export const stageStatus = v.union(
  v.literal("not_started"), v.literal("in_progress"),
  v.literal("waiting_approval"), v.literal("approved"), v.literal("done"),
);
