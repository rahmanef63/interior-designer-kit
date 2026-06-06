import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Interior Studio",
  description: "AI-assisted interior design workflow — 16 stages, lead to handover.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <nav className="topbar">
          <a href="/" className="brand">Interior Studio</a>
          <div className="links">
            <a href="/dashboard">Pipeline</a>
            <a href="/settings">Settings</a>
          </div>
        </nav>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
