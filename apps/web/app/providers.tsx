"use client";

import { ReactNode, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

/**
 * Wraps the app in a Convex provider when NEXT_PUBLIC_CONVEX_URL is set.
 * Falls back to a passthrough so the UI renders before the backend is wired.
 */
export function Providers({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    return url ? new ConvexReactClient(url) : null;
  }, []);

  if (!client) return <>{children}</>;
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
