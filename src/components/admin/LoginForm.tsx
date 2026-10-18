"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, User, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="admin-root admin-login">
      {/* Dynamic blurred original artworks composition background */}
      <div className="admin-login-art-backdrop" aria-hidden="true">
        <div className="admin-art-tile admin-art-tile-1">
          <Image
            src="/artworks/the-crimson-queen.webp"
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="admin-art-tile admin-art-tile-2">
          <Image
            src="/artworks/golden-energy.webp"
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="admin-art-tile admin-art-tile-3">
          <Image
            src="/artworks/love-in-every-color.webp"
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="admin-art-tile admin-art-tile-4">
          <Image
            src="/artworks/petals-of-serenity.webp"
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
        </div>
        {/* Artistic museum lighting and blur overlays */}
        <div className="admin-art-blur-glass" />
        <div className="admin-art-vignette" />
      </div>

      {/* Luxury Frosted Glass Login Card */}
      <div className="admin-login-card">
        <div className="admin-login-header">
          <p className="admin-wordmark">
            Binaare<span>GALLERY STUDIO</span>
          </p>
          <div className="admin-login-eyebrow">
            <Sparkles size={12} />
            <span>Curator &amp; Management Studio</span>
          </div>
          <h1>A space for your creativity.</h1>
          <p className="admin-muted">
            Sign in to curate original artworks, manage exhibition stories, and customize your gallery.
          </p>
        </div>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            const form = new FormData(event.currentTarget);
            try {
              const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username: form.get("username"),
                  password: form.get("password"),
                }),
              });
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.error || "Sign-in failed. Please verify your credentials.");
              }
              window.location.assign("/admin");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not connect to authentication service.");
              setBusy(false);
            }
          }}
        >
          {/* Username Field */}
          <div className="admin-login-field">
            <label htmlFor="login-username">
              <span className="admin-login-label-text">Username</span>
            </label>
            <div className="admin-login-input-wrap">
              <span className="admin-login-icon">
                <User size={16} />
              </span>
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                required
                autoFocus
                placeholder="e.g. admin or binaaree"
                className="admin-login-input"
              />
            </div>
          </div>

          {/* Password Field with View/Hide Toggle */}
          <div className="admin-login-field">
            <label htmlFor="login-password">
              <span className="admin-login-label-text">Password</span>
            </label>
            <div className="admin-login-input-wrap">
              <span className="admin-login-icon">
                <Lock size={16} />
              </span>
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Enter password"
                className="admin-login-input"
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <button className="admin-primary admin-login-submit" disabled={busy} type="submit">
            {busy ? "Authenticating…" : "Sign In to Studio"}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link href="/" className="admin-back">
            <ArrowLeft size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: "4px" }} />
            Return to Gallery
          </Link>
        </div>
      </div>
    </main>
  );
}