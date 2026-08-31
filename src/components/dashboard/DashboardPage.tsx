import { BarChart3, BookOpen, CalendarDays, ChevronRight, Clock3, LogOut, LayoutDashboard, Settings, Target, TimerReset, Trophy } from "lucide-react";
import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import styles from "./DashboardPage.module.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", group: "OVERVIEW" },
  { label: "My Exam", icon: Target, href: "/exam-setup", group: "PREPARATION" },
  { label: "Syllabus", icon: BookOpen, href: "/syllabus", group: "PREPARATION" },
  { label: "Study Plan", icon: CalendarDays, href: "#", group: "PREPARATION", disabled: true },
  { label: "Sessions", icon: Clock3, href: "#", group: "PREPARATION", disabled: true },
  { label: "Revision", icon: TimerReset, href: "#", group: "PREPARATION", disabled: true },
  { label: "Tests", icon: Trophy, href: "#", group: "PREPARATION", disabled: true },
  { label: "Analytics", icon: BarChart3, href: "#", group: "INSIGHTS", disabled: true },
];

export async function DashboardPage() {
  const data = await getDashboardData();
  const firstName = data.user.name.split(/\s+/)[0] || data.user.name;
  const initials = data.user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
  const groups = ["OVERVIEW", "PREPARATION", "INSIGHTS"];

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <a className={styles.brand} href="/"><img src="/preppath-logo.svg" alt="PrepPath" /><span>PrepPath</span></a>
        {groups.map((group) => (
          <div key={group} className={styles.sidebarGroup}>
            <div className={styles.sidebarLabel}>{group}</div>
            <nav className={styles.sidebarNav}>
              {navigation.filter((item) => item.group === group).map(({ label, icon: Icon, href, disabled }) => (
                <a key={label} href={disabled ? undefined : href} aria-disabled={disabled || undefined} className={`${styles.sidebarLink} ${label === "Dashboard" ? styles.active : ""} ${disabled ? styles.disabled : ""}`}>
                  <Icon size={16} strokeWidth={1.9} /><span>{label}</span>{disabled && <small>Later</small>}
                </a>
              ))}
            </nav>
          </div>
        ))}
        <div className={styles.sidebarSpacer} />
        <a className={styles.sidebarLink} href="#"><Settings size={16} strokeWidth={1.9}/><span>Settings</span></a>
        <form action={async () => { "use server"; await logoutAction(); }}>
          <button className={styles.logoutButton} type="submit"><LogOut size={16} strokeWidth={1.9}/><span>Log out</span></button>
        </form>
        <div className={styles.profileMini}><div className={styles.avatar}>{initials}</div><div className={styles.profileCopy}><strong>{data.user.name}</strong><span>{data.user.email}</span></div></div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>YOUR PREPARATION</p><h1>Good morning, {firstName}.</h1><p className={styles.subhead}>{data.exam ? `Your ${data.exam.name} workspace is ready.` : "Your preparation workspace is ready when you are."}</p></div>
        </header>
        {data.exam ? <ExamOverview exam={data.exam} syllabus={data.syllabus} /> : <EmptyDashboard />}
      </main>
    </div>
  );
}

function ExamOverview({ exam, syllabus }: { exam: NonNullable<Awaited<ReturnType<typeof getDashboardData>>["exam"]>; syllabus: Awaited<ReturnType<typeof getDashboardData>>["syllabus"] }) {
  const daysRemaining = exam.targetExamDate ? Math.max(0, Math.ceil((new Date(`${exam.targetExamDate}T00:00:00`).getTime() - Date.now()) / 86400000)) : null;
  return (
    <div className={styles.content}>
      <section className={styles.examCard}>
        <div className={styles.examCopy}>
          <p className={styles.eyebrow}>CURRENT EXAM</p>
          <h2>{exam.name} <span>— {exam.subject}</span></h2>
          <div className={styles.examMeta}><span>Paper {exam.paper}</span><i /> <span>{exam.classLevel || "Class 11–12"}</span><i /><span>{exam.questions ?? "—"} questions</span><i /><span>{exam.marks ?? "—"} marks</span><i /><span>{exam.durationMinutes ?? "—"} min</span></div>
        </div>
        <div className={styles.countdown}>{daysRemaining !== null ? <><small>EXAM COUNTDOWN</small><strong>{daysRemaining}</strong><span>days remaining</span></> : <><small>EXAM DATE</small><strong>—</strong><span>Not set</span></>}</div>
        <a href="/exam-setup" className={styles.manage}>Manage exam <ChevronRight size={14}/></a>
      </section>

      <section className={styles.metricGrid}>
        <Metric label="Syllabus" value="0%" detail={`${syllabus.units} units · ${syllabus.topics} topics`} icon={<BookOpen size={16}/>}/>
        <Metric label="Study time" value="0m" detail="No sessions logged yet" icon={<Clock3 size={16}/>}/>
        <Metric label="Revision" value="0" detail="No revisions due" icon={<TimerReset size={16}/>}/>
        <Metric label="Tests" value="0" detail="No tests completed" icon={<Trophy size={16}/>}/>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <div className={styles.panelHead}><div><p className={styles.eyebrow}>GETTING STARTED</p><h3>Build your preparation system.</h3></div><span className={styles.progressLabel}>0 / 3</span></div>
          <div className={styles.checklist}>
            <ChecklistItem done title="Choose your exam" detail={`${exam.name} · Paper ${exam.paper} · ${exam.subject}`}/>
            <ChecklistItem done={false} title="Work through your syllabus" detail={`Start with ${syllabus.units} units and ${syllabus.topics} topics`}/>
            <ChecklistItem done={false} title="Log your first study session" detail="Your dashboard will start learning your real pace"/>
          </div>
        </article>
        <article className={styles.panelAccent}>
          <p className={styles.eyebrow}>NEXT BEST ACTION</p>
          <div className={styles.actionIcon}><BookOpen size={20}/></div>
          <h3>Start with your syllabus.</h3>
          <p>Your Bihar STET Computer Science syllabus is loaded and ready for topic-level tracking.</p>
          <a href="/syllabus" className={styles.primaryAction}>Open syllabus <ChevronRight size={14}/></a>
        </article>
      </section>
    </div>
  );
}

function ChecklistItem({ done, title, detail }: { done: boolean; title: string; detail: string }) {
  return <div className={styles.checkItem}><span className={`${styles.checkCircle} ${done ? styles.checkDone : ""}`}>{done ? "✓" : ""}</span><div><strong>{title}</strong><span>{detail}</span></div></div>;
}

function Metric({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return <article className={styles.metric}><div className={styles.metricTop}><span className={styles.metricIcon}>{icon}</span><span>{label}</span></div><strong>{value}</strong><small>{detail}</small></article>;
}

function EmptyDashboard() {
  return <section className={styles.emptyDashboard}><div className={styles.emptyIcon}><Target size={22}/></div><p className={styles.eyebrow}>WELCOME TO PREPPATH</p><h2>Let&apos;s build your preparation path.</h2><p className={styles.emptyCopy}>You haven&apos;t set up an exam yet. Choose your exam and preferences first. PrepPath will then build your dashboard from your own preparation data.</p><a className={styles.setupButton} href="/exam-setup">Set up my exam <ChevronRight size={15}/></a></section>;
}
