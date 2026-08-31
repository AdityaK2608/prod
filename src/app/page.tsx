import { ArrowRight, BarChart3, BookOpen, CalendarDays, CheckCircle2, Clock3, Target } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Syllabus, not tasks", text: "Break an exam into subjects, chapters, and topics, then see exactly what remains." },
  { icon: CalendarDays, title: "A plan you can follow", text: "Turn the exam date and your available time into a practical daily study plan." },
  { icon: Clock3, title: "Track the work", text: "Log focused study sessions and connect your time to the topics that matter." },
  { icon: CheckCircle2, title: "Revision built in", text: "Bring completed topics back at the right time instead of relying on memory." },
  { icon: BarChart3, title: "Know your performance", text: "Follow syllabus coverage, study consistency, test scores, and weak areas." },
  { icon: Target, title: "Stay on track", text: "See whether your current pace is enough for your target exam date." },
];

export default function Home() {
  return (
    <main>
      <nav className="container nav">
        <a className="logo" href="#top"><img className="logo-image" src="/preppath-logo.svg" alt="PrepPath" /><span>PrepPath</span></a>
        <div className="nav-links"><a href="#features">Product</a><a href="#how-it-works">How it works</a><a href="#roadmap">Roadmap</a></div>
        <div className="nav-auth"><a className="nav-login" href="/login">Log in</a><a className="nav-cta" href="/signup">Get started</a></div>
      </nav>

      <section id="top" className="container hero">
        <div className="hero-copy">
          <div className="badge"><span className="dot" /> Built for exam aspirants</div>
          <h1>Prepare with a plan.<br /><span>Progress with purpose.</span></h1>
          <p>PrepPath gives you one focused place to plan your exam, track your syllabus, log study sessions, manage revision, and understand how you are progressing.</p>
          <div className="actions"><a className="primary" href="/signup">Build your PrepPath <ArrowRight size={15} /></a><a className="secondary" href="/login">I already have an account</a></div>
          <div className="hero-note"><CheckCircle2 size={14} /> Free to start · Built for any exam</div>
        </div>

        <div className="preview" aria-label="PrepPath dashboard preview">
          <div className="preview-top"><div className="preview-brand"><img src="/preppath-logo.svg" alt="" /><span>PrepPath</span></div><div className="preview-dots"><span /><span /><span /></div></div>
          <div className="preview-body">
            <aside className="side"><div className="side-item active">Overview</div><div className="side-item">Syllabus</div><div className="side-item">Study plan</div><div className="side-item">Revision</div><div className="side-item">Tests</div><div className="side-item">Analytics</div></aside>
            <div className="main"><div className="mini-top"><div><div className="small-muted">YOUR PREPARATION</div><div className="small-title">Good morning, Aspirant.</div><div className="small-muted">UPSC CSE 2027 · 248 days remaining</div></div><div className="mini-chip">On track</div></div>
              <div className="stats"><div className="stat"><span>Progress</span><b>62%</b></div><div className="stat"><span>Today</span><b>3h 25m</b></div><div className="stat"><span>Health</span><b>78</b></div></div>
              <div className="mini-panel"><div className="progress-head"><span>Overall syllabus</span><b>62%</b></div><div className="bar"><div className="fill" /></div><div className="mini-foot"><span>38 topics left</span><span>+8% this week</span></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section how-section">
        <div className="container section-head"><p className="eyebrow">HOW PREPPATH WORKS</p><h2>Everything starts with your exam.</h2><p>Set the goal first. PrepPath then gives every other part of your preparation a structure.</p></div>
        <div className="container flow"><div className="flow-step"><span>01</span><strong>Choose your exam</strong><p>Pick a supported exam or create your own.</p></div><div className="flow-line" /><div className="flow-step"><span>02</span><strong>Map your syllabus</strong><p>Organize subjects, chapters, and topics.</p></div><div className="flow-line" /><div className="flow-step"><span>03</span><strong>Study & track</strong><p>Follow the plan and record your real work.</p></div><div className="flow-line" /><div className="flow-step"><span>04</span><strong>Improve</strong><p>Use progress and performance to adjust.</p></div></div>
      </section>

      <section id="features" className="section feature-section">
        <div className="container section-head"><p className="eyebrow">THE PRODUCT</p><h2>A command center for serious preparation.</h2><p>Focused tools, connected around the way students actually prepare for an exam.</p></div>
        <div className="container features">{features.map(({ icon: Icon, title, text }) => <article className="feature" key={title}><div className="icon"><Icon size={17} /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section id="roadmap" className="section roadmap-section">
        <div className="container roadmap-card"><div><p className="eyebrow">V1 → V2 → BEYOND</p><h2>Start simple. Build smarter over time.</h2><p>We are building the fundamentals first, then layering adaptive planning and deeper insights on top of your real preparation data.</p></div><a className="roadmap-link" href="/signup">Start building <ArrowRight size={15} /></a></div>
      </section>

      <footer className="container footer"><div><span className="footer-logo"><img src="/preppath-logo.svg" alt="" /> PrepPath</span><p>Your exam preparation, with a clear path forward.</p></div><span>© 2026 PrepPath</span></footer>
    </main>
  );
}
