import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
const crons = cronJobs();
// Daily 08:00 WIB (01:00 UTC): surface at-risk deadlines.
crons.daily("check deadlines", { hourUTC: 1, minuteUTC: 0 }, internal.automation.checkDeadlines, {});
export default crons;
