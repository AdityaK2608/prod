import { BarChart3, BookOpen, CalendarDays, ChevronRight, Clock3, LayoutDashboard, LogOut, Settings, Target, TimerReset, Trophy } from "lucide-react";
import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import styles from "./DashboardPage.module.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", group: "OVERVIEW" },
  { label: "My Exam", icon: Target, href: "/exam-setup", group: "PREPARATION" },
  { label: "Syllabus", icon: BookOpen, href: "#", group: "PREPARATION", disabled: true },
  { label: "Study Plan", icon: CalendarDays, href: "#", group: "PREPARATION", disabled: true },
  { label: "Sessions", icon: Clock3, href: "#", group: "PREPARATION", disabled: true },
  { label: "Revision", icon: TimerReset, href: "#", group: "PREPARATION", disabled: true },
  { label: "Tests", icon: Trophy, href: "#", group: "PREPARATION", disabled: true },
  { label: "Analytics", icon: BarChart3, href: "#", group: "INSIGHTS", disabled: true },
];

export async function DashboardPage() {
  const data = await getDashboardData();
  const { name, email } = data.user;
  const firstName = name.split(/\s+/)[0] || name;
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
  const groups = ["OVERVIEW", "PREPARATION", "INSIGHTS"];

  return <div className="app-shell">
    <aside className="app-sidebar">
      <a className="app-brand" href="/"><img src="/preppath-logo.svg" alt="PrepPath" className="app-brand-mark" /><span>PrepPath</span></a>
      {groups.map((group) => <div key={group} className={styles.sidebarGroup}><div className="sidebar-label">{group}</div><nav className="sidebar-nav">
        {navigation.filter((item) => item.group === group).map(({ label, icon: Icon, href, disabled }) => <a key={label} href={href} aria-disabled={disabled || undefined} className={`sidebar-link ${label === "Dashboard" ? "active" : ""} ${disabled ? "disabled" : ""}`}><Icon size={16} strokeWidth={1.9}/><span>{label}</span>{disabled && <small>Later</small>}</a>)}
      </nav></div>)}
      <div className="sidebar-spacer" />
      <a href="#" className="sidebar-link"><Settings size={16} strokeWidth={1.9}/><span>Settings</span></a>
      <form action={async () => { "use server"; await logoutAction(); }} className={styles.logoutForm}><button className="sidebar-link" type="submit"><LogOut size={16} strokeWidth={1.9}/><span>Log out</span></button></form>
      <div className="profile-mini"><div className="avatar">{initials}</div><div><strong>{name}</strong><span>{email}</span></div><ChevronRight size={14} className="profile-chevron"/></div>
    </aside>

    <main className="app-main">
      <header className="app-header"><div><p className="eyebrow">YOUR PREPARATION</p><h1>Good morning, {firstName}.</h1><p className="header-sub">{data.exam ? `Your ${data.exam.name} workspace is ready.` : "Your preparation workspace is ready when you are."}</p></div></header>
      {data.exam ? <ExamOverview exam={data.exam} /> : <EmptyDashboard />}
    </main>
  </div>;
}

function ExamOverview({ exam }: { exam: NonNullable<Awaited<ReturnType<typeof getDashboardData>>["exam"]> }) {
  const date = exam.targetExamDate ? new Date(`${exam.targetExamDate}T00:00:00`) : null;
  const daysRemaining = date ? Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000)) : null;
  return <div className={styles.dashboardContent}>
    <section className={styles.examHero}>
      <div><p className="eyebrow">CURRENT EXAM</p><h2>{exam.name} — {exam.subject}</h2><p>Paper {exam.paper} · {exam.classLevel || "Class 11–12"} · {exam.questions ?? "—"} questions · {exam.marks ?? "—"} marks · {exam.durationMinutes ?? "—"} minutes</p></div>
      <div className={styles.countdown}>{daysRemaining !== null ? <><span>COUNTDOWN</span><strong>{daysRemaining}</strong><small>days remaining</small></> : <><span>EXAM DATE</span><strong>—</strong><small>Not set</small></>}</div>
      <a className={styles.manageExam} href="/exam-setup">Manage exam <ChevronRight size={14}/></a>
    </section>
    <section className={styles.realStats}><Stat label="Syllabus progress" value="0%" detail="No topics tracked yet"/><Stat label="Study time" value="0m" detail="No sessions logged yet"/><Stat label="Revision" value="0 due" detail="No revisions logged yet"/><Stat label="Tests" value="0" detail="No tests completed yet"/></section>
    <section className={styles.firstAction}><div className={styles.actionIcon}><BookOpen size={21}/></div><div><p className="eyebrow">NEXT STEP</p><h2>Start with your syllabus.</h2><p>Your exam is saved. The next module will load the STET Computer Science syllabus and let you track real topic-level progress.</p></div><a href="#" className={styles.primaryAction}>Open syllabus <ChevronRight size={15}/></a></section>
  </div>;
}

function EmptyDashboard() { return <section className={styles.emptyDashboard}><div className={styles.emptyIcon}><Target size={23}/></div><p className="eyebrow">WELCOME TO PREPPATH</p><h2>Let&apos;s build your preparation path.</h2><p className={styles.emptyCopy}>You haven&apos;t set up an exam yet. Choose your exam and preferences first. PrepPath will then build your dashboard from your own preparation data.</p><a className={styles.setupButton} href="/exam-setup">Set up my exam <ChevronRight size={15}/></a><div className={styles.emptyNote}><span>No demo progress</span><span>No placeholder study time</span><span>No fake exam countdown</span></div></section>; }
function Stat({ label, value, detail }: { label:string; value:string; detail:string }) { return <article className={styles.realStat}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
