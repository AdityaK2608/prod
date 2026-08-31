import { BarChart3, BookOpen, CalendarDays, ChevronRight, Clock3, LayoutDashboard, Settings, Target, TimerReset, Trophy } from "lucide-react";
import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import "./DashboardPage.module.css";

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

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <a className="app-brand" href="/"><img src="/preppath-logo.svg" alt="PrepPath" className="app-brand-mark" /><span>PrepPath</span></a>
        {groups.map((group) => (
          <div key={group} className="sidebar-group">
            <div className="sidebar-label">{group}</div>
            <nav className="sidebar-nav">
              {navigation.filter((item) => item.group === group).map(({ label, icon: Icon, href, disabled }) => (
                <a key={label} href={href} aria-disabled={disabled || undefined} className={`sidebar-link ${label === "Dashboard" ? "active" : ""} ${disabled ? "disabled" : ""}`}>
                  <Icon size={16} strokeWidth={1.9} /><span>{label}</span>{disabled && <small>Later</small>}
                </a>
              ))}
            </nav>
          </div>
        ))}
        <div className="sidebar-spacer" />
        <a href="#" className="sidebar-link"><Settings size={16} strokeWidth={1.9} /><span>Settings</span></a>
        <div className="profile-mini"><div className="avatar">{initials}</div><div><strong>{name}</strong><span>{email}</span></div></div>
      </aside>

      <main className="app-main">
        <header className="app-header"><div><p className="eyebrow">YOUR PREPARATION</p><h1>Good morning, {firstName}.</h1><p className="header-sub">Your preparation workspace is ready when you are.</p></div></header>
        <section className="empty-dashboard">
          <div className="empty-icon"><Target size={23} /></div>
          <p className="eyebrow">WELCOME TO PREPPATH</p>
          <h2>Let&apos;s build your preparation path.</h2>
          <p className="empty-copy">You haven&apos;t set up an exam yet. Choose your exam and preferences first. PrepPath will then build your dashboard from your own preparation data.</p>
          <a className="setup-button" href="/exam-setup">Set up my exam <ChevronRight size={15} /></a>
          <div className="empty-note"><span>No demo progress.</span><span>No placeholder study time.</span><span>No fake exam countdown.</span></div>
        </section>
      </main>
    </div>
  );
}
