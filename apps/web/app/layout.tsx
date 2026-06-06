import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ModeBadge } from "@/components/ModeBadge";

export const metadata: Metadata = {
  title: "Interior Studio",
  description: "AI-assisted interior design workflow — 16 stages, lead to handover.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <nav className="topbar">
          <span className="brand-wrap">
            <a href="/" className="brand">Interior Studio</a>
            <ModeBadge />
          </span>
          <div className="links">
            <a href="/dashboard">Pipeline</a>
            <a href="/projects">Projects</a>
            <a href="/settings">Settings</a>
          </div>
        </nav>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
