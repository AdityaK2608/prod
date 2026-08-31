import { BarChart3, BookOpen, CalendarDays, Check, ChevronRight, Clock3, Target } from "lucide-react";

export default function Home() {
  return (
    <main>
      <nav className="container nav">
        <a className="logo" href="#top"><img className="logo-image" src="/preppath-logo.svg" alt="PrepPath" /><span>PrepPath</span></a>
        <div className="nav-links"><a href="#features">Features</a><a href="#vision">Vision</a><a href="#status">Status</a></div>
        <div className="nav-auth"><a className="nav-login" href="/login">Log in</a><a className="nav-cta" href="/signup">Get started</a></div>
      </nav>

      <section id="top" className="container hero">
        <div className="badge"><span className="dot" /> Product in build</div>
        <h1>Your exam preparation, with a clear path forward.</h1>
        <p>PrepPath is being built for students and aspirants who want to plan their syllabus, track real progress, stay on top of revisions, and know exactly what to do next.</p>
        <div className="actions"><a className="primary" href="/signup">Start your preparation <ChevronRight size={15} style={{verticalAlign:"middle"}} /></a><a className="secondary" href="/login">Log in</a></div>

        <div className="preview" aria-label="PrepPath dashboard preview">
          <div className="preview-top"><span className="circle"/><span className="circle"/><span className="circle"/></div>
          <div className="dashboard">
            <aside className="side"><div className="side-brand"><img src="/preppath-logo.svg" alt="" /> <span>PrepPath</span></div><div className="side-item active">Overview</div><div className="side-item">Syllabus</div><div className="side-item">Study Plan</div><div className="side-item">Revision</div><div className="side-item">Tests</div><div className="side-item">Analytics</div></aside>
            <div className="main"><div className="small-title">Good morning, Aspirant.</div><div className="small-muted">UPSC CSE 2027 · 248 days remaining</div><div className="stats"><div className="stat"><b>62%</b><span>Overall progress</span></div><div className="stat"><b>3h 25m</b><span>Study time today</span></div><div className="stat"><b>78 / 100</b><span>Preparation health</span></div></div><div className="progress-card"><div className="progress-head"><span>Syllabus progress</span><span>62%</span></div><div className="bar"><div className="fill"/></div></div></div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container">
          <div className="section-head"><h2>Built around the way exams are actually prepared for.</h2><p>Not another generic task manager. PrepPath is designed around syllabus, study sessions, revision, tests, and the gap between where you are and where you need to be.</p></div>
          <div className="features">
            <Feature icon={<BookOpen size={18}/>} title="Syllabus tracking" text="Break an exam into subjects, chapters, and topics. Know what is done, what is pending, and what needs another look." />
            <Feature icon={<CalendarDays size={18}/>} title="Study planning" text="Turn your exam date and available time into a practical preparation plan you can actually follow." />
            <Feature icon={<Clock3 size={18}/>} title="Study sessions" text="Log focused study time and connect every session to the topic you are preparing." />
            <Feature icon={<Check size={18}/>} title="Smart revision" text="Keep completed topics from being forgotten with a structured revision cycle." />
            <Feature icon={<BarChart3 size={18}/>} title="Performance analytics" text="See study trends, syllabus coverage, test performance, and the areas costing you marks." />
            <Feature icon={<Target size={18}/>} title="Preparation health" text="Understand whether your current pace is enough to reach your target before exam day." />
          </div>
        </div>
      </section>

      <section id="vision" className="section">
        <div className="container" style={{textAlign:"center"}}><div className="badge">The roadmap</div><div className="section-head" style={{marginTop:20}}><h2>Plan. Study. Revise. Test. Improve.</h2><p>V1 starts with the fundamentals. Future versions will use your preparation data to create adaptive plans and turn PrepPath into a personal exam preparation command center.</p></div></div>
      </section>

      <section id="status" className="section" style={{background:"#f8f7ff"}}>
        <div className="container" style={{textAlign:"center"}}><div className="badge"><span className="dot"/> Currently building V1</div><h2 style={{marginTop:18}}>PrepPath is on its way.</h2><p style={{maxWidth:560,margin:"0 auto",color:"#68657a",lineHeight:1.6}}>We&apos;re building the first version with a simple goal: make exam preparation measurable, structured, and easier to stay consistent with.</p></div>
      </section>

      <footer className="container footer"><span>© 2026 PrepPath</span></footer>
    </main>
  );
}

function Feature({icon,title,text}:{icon:React.ReactNode;title:string;text:string}){
  return <article className="feature"><div className="icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>;
}
