"use client";

import { FormEvent, useState } from "react";
import { loginAction, signupAction } from "@/features/auth/actions/auth.actions";

export function HomeAuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError(""); setMessage("");
    const result = mode === "login"
      ? await loginAction(new FormData(event.currentTarget))
      : await signupAction(new FormData(event.currentTarget));
    setPending(false);
    if (result.error) return setError(result.error);
    if (mode === "login") window.location.href = "/";
    else setMessage("Account created. Check your email to verify it.");
  }

  return <section className="home-auth-card">
    <div className="auth-tabs"><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">Create account</button><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">Log in</button></div>
    <div className="home-auth-copy"><p className="eyebrow">PREPPATH</p><h2>{mode === "signup" ? "Start your preparation." : "Welcome back."}</h2><p>{mode === "signup" ? "Create your account. We’ll take you to exam setup next." : "Log in to continue where you left off."}</p></div>
    <form className="home-auth-form" onSubmit={submit}>
      {mode === "signup" && <label>Name<input name="name" autoComplete="name" placeholder="Your name" required /></label>}
      <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
      <label>Password<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="At least 8 characters" required /></label>
      {error && <p className="auth-error">{error}</p>}{message && <p className="auth-success">{message}</p>}
      <button className="home-auth-submit" disabled={pending}>{pending ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}</button>
    </form>
    <div className="home-auth-foot">Free to start · Your preparation data stays connected to your account.</div>
  </section>;
}
