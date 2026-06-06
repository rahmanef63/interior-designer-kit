"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@id/convex/convex/_generated/api";

const AUTH_ENABLED = !!process.env.NEXT_PUBLIC_CONVEX_URL;

export function AuthNav() {
  if (!AUTH_ENABLED) return null; // mock mode: no auth UI
  return <AuthNavInner />;
}

function AuthNavInner() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const me = useQuery(api.users.currentUser);
  if (isLoading) return null;
  if (!isAuthenticated) return <a href="/signin">Masuk</a>;
  const label = me?.name || me?.email || "User";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, marginLeft: 18 }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <button
        onClick={() => signOut()}
        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", textDecoration: "underline", font: "inherit", fontSize: 13 }}
      >
        Keluar
      </button>
    </span>
  );
}
