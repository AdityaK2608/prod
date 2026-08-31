import { ArrowRight, BookOpen, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { getSyllabus, getUserExam } from "./syllabus.service";
import { navigate } from "../../app/router";
import type { SessionUser, AppExam } from "../../types/app";

export function Syllabus({ user }: { user: SessionUser }) {
  const [exam, setExam] = useState<AppExam | null>(null); const [units, setUnits] = useState<any[]>([]); const [filter, setFilter] = useState("all"); const [error, setError] = useState("");
  useEffect(() => { (async () => { try { const current = await getUserExam(user.id); if (!current) { navigate("/exam-setup"); return; } setExam(current); setUnits(await getSyllabus(user.id, current.variantId)); } catch (err) { setError(err instanceof Error ? err.message : "Unable to load syllabus."); } })(); }, [user.id]);
  if (error) return <div className="boot"><div><strong>Unable to load your syllabus.</strong><p>{error}</p><button className="primary" onClick={() => window.location.reload()}>Try again</button></div></div>;
  const visible = filter === "all" ? units : units.filter(unit => unit.unitNumber <= Number(filter));
  return <AppShell user={user} active="syllabus"><div className="contentWrap"><header className="pageHead"><div><span>SYLLABUS</span><h1>{exam?.examName || "Your syllabus"}</h1><p>{exam?.subject || ""} · Track every topic as you prepare.</p></div><select className="smallSelect" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All units</option>{units.map(unit => <option key={unit.id} value={unit.unitNumber}>Unit {unit.unitNumber}</option>)}</select></header>
    <div className="unitList">{visible.map(unit => <section className="unit" key={unit.id}><div className="unitHeader"><span>UNIT {unit.unitNumber}</span><h2>{unit.title}</h2><small>{unit.topics.filter((topic:any) => topic.status === "completed").length} / {unit.topics.length} completed</small></div><div className="topicList">{unit.topics.map((topic:any) => <a key={topic.id} href={`#/topic/${topic.id}`} className="topicRow"><span className={`status ${topic.status}`}>{topic.status === "completed" ? <Check size={13}/> : topic.status === "in_progress" ? <span/> : null}</span><div><strong>{topic.topicNumber}. {topic.title}</strong><small>{topic.estimatedMinutes ? `${topic.estimatedMinutes} min` : "Self-paced"}{topic.difficulty ? ` · ${topic.difficulty}` : ""}</small></div><ArrowRight/></a>)}</div></section>)}</div>
  </div></AppShell>;
}
