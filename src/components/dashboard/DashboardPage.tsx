import { BarChart3, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Clock3, LayoutDashboard, Settings, Target, TimerReset, Trophy } from "lucide-react";
import "./DashboardPage.module.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", group: "OVERVIEW" },
  { label: "My Exam", icon: Target, href: "#", group: "PREPARATION" },
  { label: "Syllabus", icon: BookOpen, href: "#", group: "PREPARATION" },
  { label: "Study Plan", icon: CalendarDays, href: "#", group: "PREPARATION" },
  { label: "Sessions", icon: Clock3, href: "#", group: "PREPARATION" },
  { label: "Revision", icon: TimerReset, href: "#", group: "PREPARATION" },
  { label: "Tests", icon: Trophy, href: "#", group: "PREPARATION" },
  { label: "Analytics", icon: BarChart3, href: "#", group: "INSIGHTS" },
];

const subjects = [
  { name: "Digital Logic", value: 72, topics: "18 of 25 topics" },
  { name: "Computer Architecture", value: 54, topics: "13 of 24 topics" },
  { name: "Programming & Data Structures", value: 41, topics: "17 of 42 topics" },
  { name: "Algorithms", value: 28, topics: "8 of 29 topics" },
];

export function DashboardPage() {
  const groups = ["OVERVIEW", "PREPARATION", "INSIGHTS"];

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <a className="app-brand" href="/"><img src="/preppath-logo.svg" alt="" className="app-brand-mark" /><span>PrepPath</span></a>
        {groups.map((group) => (
          <div key={group} className="sidebar-group">
            <div className="sidebar-label">{group}</div>
            <nav className="sidebar-nav">
              {navigation.filter((item) => item.group === group).map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} className={`sidebar-link ${label === "Dashboard" ? "active" : ""}`}>
                  <Icon size={16} strokeWidth={1.9} /><span>{label}</span>
                </a>
              ))}
            </nav>
          </div>
        ))}
        <div className="sidebar-spacer" />
        <a href="#" className="sidebar-link"><Settings size={16} strokeWidth={1.9} /><span>Settings</span></a>
        <div className="profile-mini"><div className="avatar">A</div><div><strong>Aspirant</strong><span>Computer Science</span></div><ChevronRight size={14} className="profile-chevron" /></div>
      </aside>

      <main className="app-main">
        <header className="app-header">
          <div>
            <p className="eyebrow">YOUR PREPARATION</p>
            <h1>Good morning, Aspirant.</h1>
            <p className="header-sub">Bihar STET 2026 <span>·</span> Paper II <span>·</span> Computer Science</p>
          </div>
          <div className="header-actions"><button className="header-icon" aria-label="Notifications">3</button><a className="header-action" href="#">+ Log study session</a></div>
        </header>

        <section className="exam-banner">
          <div className="banner-copy"><span className="banner-kicker">CURRENT EXAM</span><h2>Bihar STET — Computer Science</h2><p>Paper II · Class 11–12 · 150 questions · 150 marks · 150 minutes</p></div>
          <div className="exam-countdown"><span>EXAM COUNTDOWN</span><strong>248</strong><small>days remaining</small></div>
          <a href="#" className="banner-link">Manage exam <ChevronRight size={14} /></a>
        </section>

        <section className="metric-grid">
          <Metric label="Overall progress" value="62%" detail="76 of 122 topics" tag="On track" />
          <Metric label="Study time" value="3h 25m" detail="Target: 4h today" tag="85%" />
          <Metric label="Preparation health" value="78 / 100" detail="Based on your recent pace" tag="Good" />
          <Metric label="Current streak" value="12 days" detail="Best: 18 days" tag="+2 this week" />
        </section>

        <section className="dashboard-grid">
          <article className="panel plan-panel">
            <div className="panel-heading"><div><p className="eyebrow">TODAY</p><h2>Study plan</h2></div><a href="#">View all</a></div>
            <div className="plan-list">
              <PlanItem time="09:00" subject="Digital Logic" topic="Boolean algebra & K-maps" status="done" duration="60 min" />
              <PlanItem time="11:00" subject="Computer Architecture" topic="CPU, buses & memory" status="current" duration="75 min" />
              <PlanItem time="15:00" subject="Teaching Art" topic="Teaching methods" status="upcoming" duration="45 min" />
              <PlanItem time="18:00" subject="Practice" topic="30 Computer Science MCQs" status="upcoming" duration="40 min" />
            </div>
          </article>

          <article className="panel focus-panel">
            <div className="panel-heading"><div><p className="eyebrow">UP NEXT</p><h2>Computer Architecture</h2></div><span className="focus-badge">Priority</span></div>
            <p className="focus-topic">CPU, addressing techniques & memory</p>
            <div className="focus-progress"><span><b>54%</b> complete</span><span>75 min</span></div>
            <div className="focus-bar"><div style={{ width: "54%" }} /></div>
            <a className="next-button" href="#">Start session <ChevronRight size={14} /></a>
          </article>
        </section>

        <section className="dashboard-grid lower-grid">
          <article className="panel progress-panel">
            <div className="panel-heading"><div><p className="eyebrow">SYLLABUS</p><h2>Subject progress</h2></div><a href="#">Open syllabus</a></div>
            <div className="subject-list">{subjects.map((subject) => <div className="subject-row" key={subject.name}><div className="subject-meta"><div><span>{subject.name}</span><small>{subject.topics}</small></div><strong>{subject.value}%</strong></div><div className="subject-track"><div className="subject-fill" style={{ width: `${subject.value}%` }} /></div></div>)}</div>
            <div className="progress-note"><span>12 topics completed this week</span><strong>+8%</strong></div>
          </article>

          <article className="panel health-panel">
            <div className="panel-heading"><div><p className="eyebrow">PREPARATION HEALTH</p><h2>You&apos;re moving well.</h2></div></div>
            <div className="health-content"><div className="health-ring"><div><strong>78</strong><span>/100</span></div></div><div className="health-bars"><HealthRow label="Syllabus coverage" value="On track" kind="good" /><HealthRow label="Study consistency" value="Strong" kind="good" /><HealthRow label="Revision" value="Needs attention" kind="warn" /><HealthRow label="Test performance" value="On track" kind="good" /></div></div>
            <div className="health-foot">Your biggest opportunity: keep revision within 7 days of completing a topic.</div>
          </article>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, detail, tag }: { label: string; value: string; detail: string; tag: string }) {
  return <article className="metric"><div className="metric-top"><span>{label}</span><b>{tag}</b></div><strong>{value}</strong><small>{detail}</small></article>;
}

function PlanItem({ time, subject, topic, status, duration }: { time: string; subject: string; topic: string; status: "done" | "current" | "upcoming"; duration: string }) {
  return <div className={`plan-item ${status}`}><span className="plan-time">{time}</span><span className="plan-status" /><div className="plan-copy"><strong>{subject}</strong><span>{topic}</span></div><span className="plan-duration">{duration}</span>{status === "done" ? <CheckCircle2 size={16} /> : status === "current" ? <span className="start-pill">In progress</span> : null}</div>;
}

function HealthRow({ label, value, kind }: { label: string; value: string; kind: "good" | "warn" }) {
  return <div className="health-row"><span>{label}</span><span className={`health-tag ${kind}`}><i />{value}</span></div>;
}
