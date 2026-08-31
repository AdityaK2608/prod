"use client";

import { FormEvent, useState } from "react";
import { loginAction, signupAction } from "@/features/auth/actions/auth.actions";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage(""); setPending(true);
    const result = mode === "login"
      ? await loginAction(new FormData(event.currentTarget))
      : await signupAction(new FormData(event.currentTarget));
    setPending(false);
    if (result.error) return setError(result.error);
    if (mode === "login") window.location.href = "/dashboard";
    else setMessage("Account created. Check your email to verify your account.");
  }

  return <form className="auth-form" onSubmit={handleSubmit}>
    {mode === "signup" && <label>Name<input name="name" autoComplete="name" placeholder="Your name" required /></label>}
    <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
    <label>Password<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="••••••••" required /></label>
    {error && <p className="auth-error">{error}</p>}
    {message && <p className="auth-success">{message}</p>}
    <button className="auth-submit" disabled={pending}>{pending ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button>
  </form>;
}
