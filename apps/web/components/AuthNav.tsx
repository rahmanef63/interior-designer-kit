"use client";

import Link from "next/link";
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
  if (!isAuthenticated) return <Link href="/signin">Masuk</Link>;
  const label = me?.name || me?.email || "User";
  return (
    <span className="nav-user">
      <span>{label}</span>
      <button className="linkbtn muted" onClick={() => signOut()}>Keluar</button>
    </span>
  );
}
