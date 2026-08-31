import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return <main className="auth-page"><section className="auth-card"><Link href="/" className="auth-brand"><img src="/preppath-logo.svg" alt="" /> PrepPath</Link><p className="eyebrow">START YOUR JOURNEY</p><h1>Create your PrepPath</h1><p className="auth-copy">Build a focused preparation path for the exam that matters to you.</p><AuthForm mode="signup" /><p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p></section></main>;
}
