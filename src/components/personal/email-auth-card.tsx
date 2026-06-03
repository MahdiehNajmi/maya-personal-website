"use client";

import {
  PASSWORD_POLICY_TEXT,
  validatePasswordPolicy,
} from "@/lib/auth/password-policy";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Mode = "sign-up" | "sign-in";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.656 32.657 29.17 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.958 3.042l5.657-5.657C34.965 6.053 29.711 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691 12.88 19.51C14.657 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.958 3.042l5.657-5.657C34.965 6.053 29.711 4 24 4c-7.682 0-14.35 4.332-17.694 10.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.602 0 10.746-2.053 14.646-5.402l-6.761-5.727C29.83 34.169 27.057 35 24 35c-5.149 0-9.621-3.321-11.283-7.946l-6.52 5.025C9.505 39.556 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a11.96 11.96 0 0 1-4.127 5.871l.003-.002 6.761 5.727C36.25 41.131 44 36 44 24c0-1.341-.138-2.65-.389-3.917Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.75 5.6.75 12c0 5.13 3.15 9.48 7.52 11.02.55.1.75-.24.75-.53v-1.9c-3.06.69-3.7-1.5-3.7-1.5-.5-1.3-1.22-1.65-1.22-1.65-1-.7.08-.69.08-.69 1.1.08 1.68 1.16 1.68 1.16.98 1.72 2.57 1.22 3.2.93.1-.73.38-1.22.69-1.5-2.44-.29-5.01-1.25-5.01-5.56 0-1.23.42-2.24 1.11-3.02-.11-.29-.48-1.46.11-3.04 0 0 .91-.3 2.98 1.15.86-.25 1.78-.37 2.7-.38.92.01 1.85.13 2.72.38 2.06-1.45 2.97-1.15 2.97-1.15.6 1.58.23 2.75.12 3.04.69.78 1.11 1.79 1.11 3.02 0 4.32-2.58 5.26-5.03 5.55.39.35.74 1.04.74 2.1v3.1c0 .29.2.64.76.53A11.27 11.27 0 0 0 23.25 12C23.25 5.6 18.27.5 12 .5Z"
      />
    </svg>
  );
}

async function readAuthResponse(res: Response) {
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(data.error || "Authentication failed. Please try again.");
  }
}

export function EmailAuthCard() {
  const searchParams = useSearchParams();
  const initialMode: Mode =
    searchParams.get("mode") === "sign-in" ? "sign-in" : "sign-up";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const passwordHint = useMemo(
    () => (mode === "sign-up" ? validatePasswordPolicy(password) : null),
    [mode, password],
  );

  const isSignUp = mode === "sign-up";
  const socialReturnTo = encodeURIComponent("/#comments");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (isSignUp) {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      const policyError = validatePasswordPolicy(password);
      if (policyError) {
        setError(policyError);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setBusy(true);
    try {
      await readAuthResponse(
        await fetch(
          isSignUp ? "/api/auth/sign-up/email" : "/api/auth/sign-in/email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          },
        ),
      );
      window.location.assign("/#comments");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="signup-card" aria-labelledby="signup-title">
      <div className="signup-card__copy">
        <p className="signup-card__eyebrow">Visitor account</p>
        <h1 id="signup-title" className="signup-card__title">
          {isSignUp ? "Create your account" : "Sign in to your account"}
        </h1>
        <p className="signup-card__lead">
          {isSignUp
            ? "Use email/password or continue with Google or GitHub. After sign-up, you will return to the home page to leave a comment."
            : "Welcome back. Sign in with your saved email and password to leave a comment."}
        </p>
      </div>

      <div className="signup-card__tabs" role="tablist" aria-label="Auth mode">
        <button
          type="button"
          className={`signup-card__tab${isSignUp ? " is-active" : ""}`}
          aria-selected={isSignUp}
          onClick={() => {
            setMode("sign-up");
            setError(null);
          }}
        >
          Sign up
        </button>
        <button
          type="button"
          className={`signup-card__tab${!isSignUp ? " is-active" : ""}`}
          aria-selected={!isSignUp}
          onClick={() => {
            setMode("sign-in");
            setError(null);
          }}
        >
          Sign in
        </button>
      </div>

      <form className="signup-form" onSubmit={onSubmit} noValidate>
        {isSignUp ? (
          <label className="signup-form__field">
            <span>Name</span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="How should we show your name?"
              disabled={busy}
            />
          </label>
        ) : null}

        <label className="signup-form__field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={busy}
            required
          />
        </label>

        <label className="signup-form__field">
          <span>Password</span>
          <input
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            disabled={busy}
            required
          />
        </label>

        {isSignUp ? (
          <>
            <label className="signup-form__field">
              <span>Confirm password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                disabled={busy}
                required
              />
            </label>
            <p className="signup-form__hint">
              {passwordHint ?? PASSWORD_POLICY_TEXT}
            </p>
          </>
        ) : null}

        {error ? (
          <p className="signup-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="signup-form__submit rb-btn" disabled={busy}>
          {busy
            ? isSignUp
              ? "Creating account..."
              : "Signing in..."
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <div className="signup-card__divider">
        <span>or continue with</span>
      </div>

      <div className="signup-card__social">
        <a
          className="auth-btn auth-btn--google"
          href={`/api/auth/login/google?returnTo=${socialReturnTo}`}
        >
          <span className="auth-btn__icon">
            <GoogleIcon />
          </span>
          <span className="auth-btn__label">Continue with Google</span>
        </a>
        <a
          className="auth-btn auth-btn--github"
          href={`/api/auth/login/github?returnTo=${socialReturnTo}`}
        >
          <span className="auth-btn__icon">
            <GitHubIcon />
          </span>
          <span className="auth-btn__label">Continue with GitHub</span>
        </a>
      </div>

      <Link className="signup-card__back" href="/#comments">
        Back to comments
      </Link>
    </section>
  );
}
