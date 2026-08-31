import { BarChart3, BookOpen, CalendarDays, CheckCircle2, Clock3, LayoutDashboard, Settings, Target, TimerReset } from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Exam", icon: Target },
  { label: "Syllabus", icon: BookOpen },
  { label: "Study Plan", icon: CalendarDays },
  { label: "Sessions", icon: Clock3 },
  { label: "Revision", icon: TimerReset },
  { label: "Tests", icon: CheckCircle2 },
  { label: "Analytics", icon: BarChart3 },
];

const subjects = [["Polity", 72], ["History", 54], ["Economics", 41]];

export default function DashboardPage() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <a className="app-brand" href="/"><img src="/preppath-logo.svg" alt="" className="app-brand-mark" /><span>PrepPath</span></a>
        <div className="sidebar-label">OVERVIEW</div>
        <nav className="sidebar-nav">{navigation.map(({ label, icon: Icon, active }) => <a key={label} href={label === "Dashboard" ? "/dashboard" : "#"} className={`sidebar-link ${active ? "active" : ""}`}><Icon size={17} strokeWidth={1.9} /><span>{label}</span></a>)}</nav>
        <div className="sidebar-spacer" />
        <a href="#" className="sidebar-link"><Settings size={17} strokeWidth={1.9} /><span>Settings</span></a>
        <div className="profile-mini"><div className="avatar">A</div><div><strong>Aspirant</strong><span>UPSC CSE 2027</span></div></div>
      </aside>

      <main className="app-main">
        <header className="app-header">
          <div><p className="eyebrow">YOUR PREPARATION</p><h1>Good morning, Aspirant.</h1><p className="header-sub">UPSC CSE 2027 <span>·</span> 248 days remaining</p></div>
          <a className="header-action" href="#">+ Log study session</a>
        </header>

        <section className="metric-grid">
          <Metric label="Overall progress" value="62%" detail="Across your syllabus" />
          <Metric label="Study time today" value="3h 25m" detail="Target: 4h 00m" />
          <Metric label="Preparation health" value="78 / 100" detail="On track for your goal" />
        </section>

        <section className="dashboard-grid">
          <article className="panel plan-panel">
            <div className="panel-heading"><div><p className="eyebrow">TODAY</p><h2>Study plan</h2></div><a href="#">View plan</a></div>
            <div className="plan-list">
              <PlanItem time="09:00" subject="Polity" topic="Parliament" status="done" />
              <PlanItem time="11:00" subject="Economics" topic="Inflation & monetary policy" status="current" />
              <PlanItem time="15:00" subject="Polity" topic="Revision — Fundamental Rights" status="upcoming" />
              <PlanItem time="18:00" subject="Mixed GS" topic="50 practice questions" status="upcoming" />
            </div>
          </article>

          <article className="panel progress-panel">
            <div className="panel-heading"><div><p className="eyebrow">SYLLABUS</p><h2>Subject progress</h2></div><a href="#">Open syllabus</a></div>
            <div className="subject-list">{subjects.map(([name, value]) => <div className="subject-row" key={name}><div className="subject-meta"><span>{name}</span><strong>{value}%</strong></div><div className="subject-track"><div className="subject-fill" style={{ width: `${value}%` }} /></div></div>)}</div>
            <div className="progress-note"><span>12 topics completed this week</span><strong>+8%</strong></div>
          </article>
        </section>

        <section className="bottom-grid">
          <article className="panel health-panel">
            <div className="panel-heading"><div><p className="eyebrow">PREPARATION HEALTH</p><h2>You&apos;re moving in the right direction.</h2></div></div>
            <div className="health-content"><div className="health-score">78<span>/100</span></div><div className="health-bars"><HealthRow label="Syllabus" value="On track" kind="good" /><HealthRow label="Study time" value="Slightly behind" kind="warn" /><HealthRow label="Revision" value="On track" kind="good" /><HealthRow label="Tests" value="On track" kind="good" /></div></div>
          </article>
          <article className="panel next-panel"><p className="eyebrow">UP NEXT</p><h2>Economics</h2><p>Inflation & monetary policy</p><div className="next-meta"><span>60 min planned</span><a href="#">Start session →</a></div></article>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className="metric"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
function PlanItem({ time, subject, topic, status }: { time: string; subject: string; topic: string; status: string }) { return <div className={`plan-item ${status}`}><span className="plan-time">{time}</span><span className="plan-status" /><div className="plan-copy"><strong>{subject}</strong><span>{topic}</span></div>{status === "done" ? <CheckCircle2 size={17} /> : status === "current" ? <span className="start-pill">In progress</span> : null}</div>; }
function HealthRow({ label, value, kind }: { label: string; value: string; kind: string }) { return <div className="health-row"><span>{label}</span><span className={`health-tag ${kind}`}><i />{value}</span></div>; }
