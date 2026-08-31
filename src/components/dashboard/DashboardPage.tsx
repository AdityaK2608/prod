import { BarChart3, BookOpen, CalendarDays, CheckCircle2, Clock3, LayoutDashboard, Settings, Target, TimerReset } from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Exam", icon: Target, href: "#" },
  { label: "Syllabus", icon: BookOpen, href: "#" },
  { label: "Study Plan", icon: CalendarDays, href: "#" },
  { label: "Sessions", icon: Clock3, href: "#" },
  { label: "Revision", icon: TimerReset, href: "#" },
  { label: "Tests", icon: CheckCircle2, href: "#" },
  { label: "Analytics", icon: BarChart3, href: "#" },
];

const subjects: [string, number, string][] = [["Polity", 72, "18 / 25 topics"], ["History", 54, "27 / 50 topics"], ["Economics", 41, "14 / 34 topics"]];

export function DashboardPage() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <a className="app-brand" href="/"><img src="/preppath-logo.svg" alt="" className="app-brand-mark" /><span>PrepPath</span></a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav">{navigation.map(({ label, icon: Icon, href }) => <a key={label} href={href} className={`sidebar-link ${label === "Dashboard" ? "active" : ""}`}><Icon size={16} strokeWidth={1.9} /><span>{label}</span></a>)}</nav>
        <div className="sidebar-spacer" />
        <a href="#" className="sidebar-link"><Settings size={16} strokeWidth={1.9} /><span>Settings</span></a>
        <div className="profile-mini"><div className="avatar">A</div><div><strong>Aspirant</strong><span>UPSC CSE 2027</span></div></div>
      </aside>

      <main className="app-main">
        <header className="app-header"><div><p className="eyebrow">OVERVIEW</p><h1>Your preparation at a glance.</h1><p className="header-sub">UPSC CSE 2027 <span>•</span> 248 days remaining</p></div><a className="header-action" href="#">+ Log study session</a></header>

        <section className="metric-grid"><Metric label="Syllabus progress" value="62%" trend="+8%" detail="12 topics completed this week" /><Metric label="Study time" value="3h 25m" trend="85%" detail="of today&apos;s 4h target" /><Metric label="Preparation health" value="78" trend="Good" detail="Your current pace is on track" /></section>

        <section className="dashboard-grid">
          <article className="panel plan-panel"><PanelHeading eyebrow="TODAY" title="Study plan" link="View full plan" /><div className="plan-list"><PlanItem time="09:00" subject="Polity" topic="Parliament" status="done" /><PlanItem time="11:00" subject="Economics" topic="Inflation & monetary policy" status="current" /><PlanItem time="15:00" subject="Polity" topic="Revision — Fundamental Rights" status="upcoming" /><PlanItem time="18:00" subject="Mixed GS" topic="50 practice questions" status="upcoming" /></div></article>
          <article className="panel progress-panel"><PanelHeading eyebrow="SYLLABUS" title="Subject progress" link="Open syllabus" /><div className="subject-list">{subjects.map(([name, value, detail]) => <div className="subject-row" key={name}><div className="subject-meta"><div><strong>{name}</strong><small>{detail}</small></div><b>{value}%</b></div><div className="subject-track"><div className="subject-fill" style={{ width: `${value}%` }} /></div></div>)}</div><div className="progress-note"><span>3 subjects active</span><a href="#">View all →</a></div></article>
        </section>

        <section className="bottom-grid">
          <article className="panel health-panel"><PanelHeading eyebrow="PREPARATION HEALTH" title="You&apos;re on the right pace." /><div className="health-content"><div className="health-ring"><div><strong>78</strong><span>/100</span></div></div><div className="health-bars"><HealthRow label="Syllabus coverage" value="On track" kind="good" /><HealthRow label="Study consistency" value="Strong" kind="good" /><HealthRow label="Revision load" value="Watch this week" kind="warn" /><HealthRow label="Test performance" value="On track" kind="good" /></div></div></article>
          <article className="panel next-panel"><p className="eyebrow">UP NEXT</p><span className="next-kicker">11:00 · 60 min</span><h2>Economics</h2><p>Inflation & monetary policy</p><a className="next-button" href="#">Start session <span>→</span></a></article>
        </section>
      </main>
    </div>
  );
}

function PanelHeading({ eyebrow, title, link }: { eyebrow: string; title: string; link?: string }) { return <div className="panel-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{link && <a href="#">{link}</a>}</div>; }
function Metric({ label, value, trend, detail }: { label: string; value: string; trend: string; detail: string }) { return <article className="metric"><div className="metric-top"><span>{label}</span><b>{trend}</b></div><strong>{value}</strong><small>{detail}</small></article>; }
function PlanItem({ time, subject, topic, status }: { time: string; subject: string; topic: string; status: "done" | "current" | "upcoming" }) { return <div className={`plan-item ${status}`}><span className="plan-time">{time}</span><span className="plan-status" /><div className="plan-copy"><strong>{subject}</strong><span>{topic}</span></div>{status === "done" ? <CheckCircle2 size={16} /> : status === "current" ? <span className="start-pill">In progress</span> : <span className="plan-more">Later</span>}</div>; }
function HealthRow({ label, value, kind }: { label: string; value: string; kind: "good" | "warn" }) { return <div className="health-row"><span>{label}</span><span className={`health-tag ${kind}`}><i />{value}</span></div>; }
