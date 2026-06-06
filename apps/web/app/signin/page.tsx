"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn("password", { email, password, flow });
      router.push("/dashboard");
    } catch {
      setError(flow === "signUp" ? "Gagal daftar. Email mungkin sudah dipakai / password < 8 karakter." : "Gagal masuk. Cek email & password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page narrow">
      <h1>{flow === "signUp" ? "Daftar" : "Masuk"}</h1>
      <p className="lead">Interior Studio — masuk untuk mengakses pipeline.</p>
      <form className="form" onSubmit={submit}>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></label>
        <button className="btn" type="submit" disabled={busy || !email || !password}>{flow === "signUp" ? "Daftar" : "Masuk"}</button>
        {error && <p className="msg" style={{ color: "var(--warn)" }}>{error}</p>}
      </form>
      <p className="lead" style={{ marginTop: 16 }}>
        {flow === "signUp" ? "Sudah punya akun? " : "Belum punya akun? "}
        <button
          onClick={() => setFlow(flow === "signUp" ? "signIn" : "signUp")}
          style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", textDecoration: "underline", font: "inherit" }}
        >
          {flow === "signUp" ? "Masuk" : "Daftar"}
        </button>
      </p>
    </main>
  );
}
