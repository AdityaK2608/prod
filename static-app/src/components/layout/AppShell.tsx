import { BarChart3, BookOpen, CalendarDays, Clock3, LogOut, Settings, Target, TimerReset, Trophy } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { navigate } from "../../app/router";
import type { SessionUser } from "../../types/app";

type Props = { children: React.ReactNode; user: SessionUser; active: string };

export function AppShell({ children, user, active }: Props) {
  const displayName = user.user_metadata?.name || user.email?.split("@")[0] || "Student";
  const initials = displayName.split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase();
  const nav = (key: string, href: string, icon: React.ReactNode, label: string) => (
    <a className={active === key ? "active" : ""} href={`#${href}`}>{icon}{label}</a>
  );
  return <div className="app">
    <aside className="sidebar">
      <a href="#/dashboard" className="sideBrand"><img src="/prod/preppath-logo.svg" alt="PrepPath"/><strong>PrepPath</strong></a>
      <nav>
        <span>OVERVIEW</span>{nav("dashboard", "/dashboard", <BarChart3/>, "Dashboard")}
        <span>PREPARATION</span>{nav("exam", "/exam-setup", <Target/>, "My Exam")}{nav("syllabus", "/syllabus", <BookOpen/>, "Syllabus")}{nav("sessions", "/sessions", <Clock3/>, "Sessions")}
        <a className="disabled"><CalendarDays/>Study Plan<i>Later</i></a><a className="disabled"><TimerReset/>Revision<i>Later</i></a><a className="disabled"><Trophy/>Tests<i>Later</i></a>
        <span>INSIGHTS</span><a className="disabled"><BarChart3/>Analytics<i>Later</i></a>
      </nav>
      <div className="sideBottom">
        <a className="disabled"><Settings/>Settings</a>
        <button onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}><LogOut/>Log out</button>
        <div className="userMini"><b>{initials}</b><div><strong>{displayName}</strong><small>{user.email}</small></div></div>
      </div>
    </aside>
    <main className="mainArea">{children}</main>
  </div>;
}
