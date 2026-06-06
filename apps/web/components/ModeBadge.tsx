"use client";

import { DATA_MODE } from "@/lib/data";

export function ModeBadge() {
  if (DATA_MODE !== "mock") return null;
  return (
    <span className="mode-badge" title="Data dummy in-memory — ganti ke Convex di lib/data/index.ts">
      MOCK
    </span>
  );
}
