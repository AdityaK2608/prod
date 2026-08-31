"use client";

import { useOptimistic, useState, useTransition } from "react";
import { BookOpen, CheckCircle2, ChevronDown, Clock3, Circle, PlayCircle } from "lucide-react";
import { updateTopicProgress } from "@/features/syllabus/syllabus.actions";
import styles from "./SyllabusPage.module.css";

type Topic = {
  id: string;
  number: number;
  title: string;
  content: { estimated_minutes: number; difficulty: string; status: string } | null;
  progress: string;
};
type Unit = { id: string; unit_number: number; title: string; topics: Topic[] };

export function SyllabusPage({ exam, units }: { exam: { name: string; paper: string; classLevel: string | null; subject: string }; units: Unit[] }) {
  const [openUnit, setOpenUnit] = useState<number | null>(1);
  const total = units.reduce((n, unit) => n + unit.topics.length, 0);
  const completed = units.reduce((n, unit) => n + unit.topics.filter((t) => t.progress === "completed").length, 0);
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const [optimisticUnits, setOptimistic] = useOptimistic(units, (state: Unit[], change: { topicId: string; status: string }) => state.map((unit) => ({ ...unit, topics: unit.topics.map((topic) => topic.id === change.topicId ? { ...topic, progress: change.status } : topic) })));

  async function toggleTopic(topic: Topic) {
    const next = topic.progress === "completed" ? "not_started" : "completed";
    setOptimistic({ topicId: topic.id, status: next });
    const fd = new FormData(); fd.set("topicId", topic.id); fd.set("status", next);
    await updateTopicProgress(fd);
  }

  return <main className={styles.page}>
    <header className={styles.header}><div><p className={styles.eyebrow}>SYLLABUS</p><h1>{exam.name} <span>· {exam.subject}</span></h1><p>{`Paper ${exam.paper} · ${exam.classLevel || "Class 11–12"}`}</p></div><div className={styles.progressBox}><span>OVERALL PROGRESS</span><strong>{progress}%</strong><div><i style={{ width: `${progress}%` }} /></div><small>{completed} of {total} topics completed</small></div></header>
    <section className={styles.intro}><BookOpen size={18}/><div><strong>Work through the syllabus in order.</strong><span>Each topic is tracked against your account. Mark a topic complete only when you are satisfied with your understanding.</span></div></section>
    <div className={styles.units}>{optimisticUnits.map((unit) => {
      const unitCompleted = unit.topics.filter((t) => t.progress === "completed").length;
      const isOpen = openUnit === unit.unit_number;
      return <section key={unit.id} className={`${styles.unit} ${isOpen ? styles.open : ""}`}>
        <button className={styles.unitHead} onClick={() => setOpenUnit(isOpen ? null : unit.unit_number)}><span className={styles.unitNumber}>{String(unit.unit_number).padStart(2, "0")}</span><span className={styles.unitTitle}><strong>{unit.title}</strong><small>{unitCompleted} / {unit.topics.length} topics completed</small></span><span className={styles.unitPercent}>{unit.topics.length ? Math.round(unitCompleted / unit.topics.length * 100) : 0}%</span><ChevronDown size={17} className={styles.chevron}/></button>
        {isOpen && <div className={styles.topicList}>{unit.topics.map((topic) => <div key={topic.id} className={styles.topic}><button className={`${styles.statusButton} ${topic.progress === "completed" ? styles.done : ""}`} onClick={() => toggleTopic(topic)} aria-label={topic.progress === "completed" ? "Mark incomplete" : "Mark complete"}>{topic.progress === "completed" ? <CheckCircle2 size={18}/> : <Circle size={18}/>}</button><div className={styles.topicMain}><strong>{topic.number}. {topic.title}</strong><div>{topic.content ? <><span><Clock3 size={12}/> {topic.content.estimated_minutes} min</span><span>{topic.content.difficulty}</span></> : <span>Content coming next</span>}</div></div>{topic.content?.status === "published" ? <span className={styles.lesson}><PlayCircle size={13}/> Lesson</span> : <span className={styles.draft}>Coming soon</span>}</div>)}</div>}
      </section>;
    })}</div>
  </main>;
}
