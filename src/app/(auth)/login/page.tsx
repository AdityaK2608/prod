import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return <main className="auth-page"><section className="auth-card"><Link href="/" className="auth-brand"><img src="/preppath-logo.svg" alt="" /> PrepPath</Link><p className="eyebrow">WELCOME BACK</p><h1>Log in to PrepPath</h1><p className="auth-copy">Continue your preparation from where you left off.</p><AuthForm mode="login" /><p className="auth-switch">New to PrepPath? <Link href="/signup">Create an account</Link></p></section></main>;
}
