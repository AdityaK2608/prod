import { ArrowRight, BookOpen, Clock3, TimerReset, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { getDashboardStats, getUserExam } from "../../lib/data";
import { navigate } from "../../app/router";
import type { SessionUser, AppExam } from "../../types/app";

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <article className="metric"><div className="metricLabel"><span>{icon}</span>{label}</div><strong>{value}</strong><small>{detail}</small></article>;
}

export function Dashboard({ user }: { user: SessionUser }) {
  const [exam, setExam] = useState<AppExam | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => { let active = true; (async () => { try { const current = await getUserExam(user.id); if (!active) return; if (!current) { navigate("/exam-setup"); return; } setExam(current); setStats(await getDashboardStats(user.id, current.variantId)); } catch (err) { if (active) setError(err instanceof Error ? err.message : "Unable to load dashboard."); } })(); return () => { active = false; }; }, [user.id]);

  if (error) return <div className="boot"><div><strong>Unable to load your dashboard.</strong><p>{error}</p><button className="primary" onClick={() => window.location.reload()}>Try again</button></div></div>;
  if (!exam) return <div className="boot">Loading your preparation…</div>;

  const completion = stats?.topics ? Math.round((stats.completedTopics / stats.topics) * 100) : 0;
  const mins = Math.floor((stats?.studyTimeSeconds || 0) / 60);
  const time = mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  const days = exam.targetExamDate ? Math.max(0, Math.ceil((new Date(`${exam.targetExamDate}T00:00:00`).getTime() - Date.now()) / 86400000)) : null;

  return <AppShell user={user} active="dashboard"><div className="contentWrap">
    <header className="pageHead"><div><span>YOUR PREPARATION</span><h1>Good morning, {(user.user_metadata?.name || "Student").split(/\s+/)[0]}.</h1><p>Your {exam.examName} workspace is ready.</p></div></header>
    <section className="examBanner"><div><span>CURRENT EXAM</span><h2>{exam.examName} <em>— {exam.subject}</em></h2><div className="meta">Paper {exam.paper} · {exam.classLevel || "Class 11–12"} · {exam.questions ?? "—"} questions · {exam.marks ?? "—"} marks · {exam.durationMinutes ?? "—"} min</div></div><div className="count"><small>EXAM COUNTDOWN</small><strong>{days === null ? "—" : days}</strong><span>{days === null ? "Date not set" : "days remaining"}</span></div></section>
    <section className="metricGrid"><Metric icon={<BookOpen/>} label="Syllabus" value={`${completion}%`} detail={`${stats?.completedTopics || 0} of ${stats?.topics || 0} topics complete`}/><Metric icon={<Clock3/>} label="Study time" value={time} detail={stats?.sessionCount ? `${stats.sessionCount} session${stats.sessionCount === 1 ? "" : "s"} logged` : "No sessions yet"}/><Metric icon={<TimerReset/>} label="Revision" value="—" detail="Coming next"/><Metric icon={<Trophy/>} label="Tests" value="—" detail="Coming next"/></section>
    <section className="dashGrid"><article className="panel"><div className="panelTop"><div><span>PREPARATION</span><h3>Keep your momentum.</h3></div><a href="#/sessions">Study now <ArrowRight/></a></div><div className="actionLine"><b>{completion}%</b><div><strong>Syllabus progress</strong><small>Complete topics to grow your score</small></div></div><div className="actionLine"><b>{time}</b><div><strong>Study time logged</strong><small>Every saved session counts</small></div></div></article><article className="panel accent"><span>NEXT BEST ACTION</span><h3>{completion ? "Continue your preparation." : "Start your first study session."}</h3><p>{completion ? "Pick the next topic from your syllabus and keep building momentum." : "Choose a syllabus topic and start a focused study block."}</p><a className="primary" href="#/sessions">Start studying <ArrowRight/></a></article></section>
  </div></AppShell>;
}
