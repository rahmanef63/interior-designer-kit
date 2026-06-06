import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Providers } from "./providers";
import { ModeBadge } from "@/components/ModeBadge";
import { AuthNav } from "@/components/AuthNav";

const AUTH_ENABLED = !!process.env.NEXT_PUBLIC_CONVEX_URL;

export const metadata: Metadata = {
  title: "Interior Studio",
  description: "AI-assisted interior design workflow — 16 stages, lead to handover.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tree = (
    <html lang="id">
      <body>
        <nav className="topbar">
          <span className="brand-wrap">
            <Link href="/" className="brand">Interior Studio</Link>
            <ModeBadge />
          </span>
          <div className="links">
            <Link href="/dashboard">Pipeline</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/settings">Settings</Link>
            <AuthNav />
          </div>
        </nav>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
  return AUTH_ENABLED ? <ConvexAuthNextjsServerProvider>{tree}</ConvexAuthNextjsServerProvider> : tree;
}
