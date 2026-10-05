"use client";
import { useState } from "react";
import Link from "next/link";
export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <main className="admin-root admin-login"><div className="admin-login-card">
    <p className="admin-wordmark">Binaare<span>GALLERY STUDIO</span></p>
    <h1>A space for your creativity.</h1><p className="admin-muted">Sign in to manage artworks, stories and the images across your website.</p>
    <form onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError("");
      const form = new FormData(event.currentTarget);
      try {
        const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: form.get("username"), password: form.get("password") }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Sign-in failed.");
        window.location.assign("/admin");
      } catch (error) { setError(error instanceof Error ? error.message : "Could not connect."); setBusy(false); }
    }}>
      <label>Username<input name="username" autoComplete="username" required autoFocus /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button className="admin-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form><Link href="/" className="admin-back">← Back to the gallery</Link>
  </div></main>;
}
