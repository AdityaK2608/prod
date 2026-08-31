"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Check, Clock3, Play, Target } from "lucide-react";
import { useState, useTransition } from "react";
import type { TopicDetail } from "@/features/syllabus/types/syllabus.types";
import { saveTopicProgress } from "@/features/syllabus/actions/syllabus.actions";
import styles from "./TopicPage.module.css";

function renderLesson(markdown: string) {
  return markdown.split("\n").map((line, index) => {
    if (line.startsWith("### ")) return <h3 key={index}>{line.slice(4)}</h3>;
    if (line.startsWith("## ")) return <h2 key={index}>{line.slice(3)}</h2>;
    if (line.startsWith("- ")) return <li key={index}>{line.slice(2)}</li>;
    if (!line.trim()) return <div key={index} className={styles.spacer} />;
    return <p key={index}>{line}</p>;
  });
}

export function TopicPage({ data }: { data: TopicDetail }) {
  const [status, setStatus] = useState(data.topic.status);
  const [confidence, setConfidence] = useState<number | null>(data.topic.confidence);
  const [pending, startTransition] = useTransition();
  const statusLabel = status === "completed" ? "Completed" : status === "in_progress" ? "In progress" : "Not started";

  function updateProgress(nextStatus: "not_started" | "in_progress" | "completed", nextConfidence = confidence) {
    setStatus(nextStatus);
    setConfidence(nextConfidence);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("topicId", data.topic.id);
      fd.set("status", nextStatus);
      if (nextConfidence) fd.set("confidence", String(nextConfidence));
      const result = await saveTopicProgress(fd);
      if (result.error) {
        setStatus(data.topic.status);
        setConfidence(data.topic.confidence);
      }
    });
  }

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href="/syllabus" className={styles.back}><ArrowLeft size={15}/> Syllabus</Link>
      <div className={styles.breadcrumb}>Unit {data.unit.unitNumber} · {data.unit.title}</div>
    </header>

    <div className={styles.layout}>
      <article className={styles.lessonCard}>
        <div className={styles.lessonTop}>
          <div><p className={styles.eyebrow}>TOPIC {data.topic.topicNumber}</p><h1>{data.topic.title}</h1></div>
          <div className={styles.meta}><span><Clock3 size={13}/>{data.content?.estimatedMinutes ?? "—"} min</span><span className={styles[difficultyClass(data.content?.difficulty)]}>{data.content?.difficulty ?? "content"}</span></div>
        </div>

        {!data.content ? <div className={styles.noContent}><BookOpen size={22}/><h2>Lesson content is not published yet.</h2><p>This topic is part of the official syllabus structure, but PrepPath has not published the learning lesson for it yet.</p></div> : <>
          <div className={styles.objectives}><p className={styles.eyebrow}>LEARNING OBJECTIVES</p>{data.content.learningObjectives.map((item) => <div key={item}><Check size={14}/><span>{item}</span></div>)}</div>
          <div className={styles.lessonBody}>{renderLesson(data.content.lessonMarkdown)}</div>
          {data.content.keyTerms.length > 0 && <section className={styles.terms}><p className={styles.eyebrow}>KEY TERMS</p><div className={styles.termGrid}>{data.content.keyTerms.map((item) => <div className={styles.term} key={item.term}><strong>{item.term}</strong><span>{item.meaning}</span></div>)}</div></section>}
        </>}
      </article>

      <aside className={styles.sidebar}>
        <section className={styles.progressCard}>
          <p className={styles.eyebrow}>YOUR PROGRESS</p>
          <div className={styles.progressStatus}><span className={`${styles.statusDot} ${styles[status]}`} /> <strong>{statusLabel}</strong></div>
          <p className={styles.sideCopy}>Update your status as you work through this lesson. Progress is saved to your account.</p>
          <button className={styles.primaryButton} disabled={pending || status === "completed"} onClick={() => updateProgress("completed")}><Check size={15}/> {status === "completed" ? "Completed" : "Mark complete"}</button>
          {status !== "completed" && <button className={styles.secondaryButton} disabled={pending} onClick={() => updateProgress("in_progress")}><Play size={14}/> Mark in progress</button>}
        </section>

        <section className={styles.confidenceCard}>
          <p className={styles.eyebrow}>CONFIDENCE</p>
          <h2>How well do you know this?</h2>
          <div className={styles.confidenceGrid}>{[1,2,3,4,5].map((value) => <button key={value} onClick={() => updateProgress(status === "not_started" ? "in_progress" : status, value)} className={confidence === value ? styles.confidenceSelected : ""}><span>{value}</span><small>{["New","Learning","Okay","Strong","Exam ready"][value-1]}</small></button>)}</div>
        </section>

        <section className={styles.nextCard}><Target size={18}/><div><p className={styles.eyebrow}>STUDY PRINCIPLE</p><strong>Understand before checking complete.</strong><span>Use confidence to tell PrepPath how ready you feel for this topic.</span></div></section>
      </aside>
    </div>
  </main>;
}

function difficultyClass(value: string | undefined) {
  return value === "hard" ? "hard" : value === "easy" ? "easy" : "medium";
}
