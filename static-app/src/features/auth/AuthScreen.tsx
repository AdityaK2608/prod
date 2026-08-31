import { useState, type FormEvent } from "react";
import { BookOpen, CalendarDays, Check, Clock3 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { navigate } from "../../app/router";

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
        if (signUpError) throw signUpError;
        setMessage("Account created. Check your email to verify it.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return <main className="landing">
    <div className="landingNav">
      <a className="brand" href="#/"><img src="/prod/preppath-logo.svg" alt="PrepPath"/><span>PrepPath</span></a>
      <span className="navTag">EXAM PREPARATION, ORGANIZED</span>
    </div>
    <div className="landingGrid">
      <section className="hero">
        <span className="pill">Built for students & aspirants</span>
        <h1>Prepare with a plan.<br/><em>Progress with purpose.</em></h1>
        <p>One focused workspace for your syllabus, study time, revision, tests, and progress — organized around the exam you are actually preparing for.</p>
        <div className="featureRow"><span><BookOpen/>Syllabus</span><span><CalendarDays/>Study plan</span><span><Clock3/>Study time</span><span><Check/>Progress</span></div>
        <div className="heroFoot">Starting with Bihar STET · Computer Science</div>
      </section>
      <section className="authCard">
        <div className="tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Log in</button><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button></div>
        <div className="authCopy"><span>PREPPATH</span><h2>{mode === "login" ? "Welcome back." : "Start your preparation."}</h2><p>{mode === "login" ? "Log in to continue where you left off." : "Create your account and choose your exam."}</p></div>
        <form onSubmit={submit}>
          {mode === "signup" && <label>Name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required/></label>}
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required/></label>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required/></label>
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}
          <button className="primary full" disabled={pending}>{pending ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button>
        </form>
        <div className="authFine">Free to use · Powered by your own preparation data</div>
      </section>
    </div>
  </main>;
}
