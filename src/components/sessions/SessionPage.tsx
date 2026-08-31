"use client";
import { useEffect, useState, useTransition } from "react";
import { ArrowLeft, CircleX, Pause, Play, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveStudySession } from "@/features/sessions/actions/session.actions";
import styles from "./SessionPage.module.css";

export function SessionPage({ topics, sessions }: any) {
  const router = useRouter();
  const [topicId, setTopicId] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const start = () => {
    setStartedAt((v) => v ?? new Date().toISOString());
    setRunning(true);
    setMessage("");
  };

  const reset = () => {
    setRunning(false);
    setSeconds(0);
    setStartedAt(null);
    setMessage("");
  };

  const save = () => {
    if (!startedAt || seconds < 1) {
      setMessage("Start the timer before saving a session.");
      return;
    }
    const fd = new FormData();
    fd.set("topicId", topicId);
    fd.set("durationSeconds", String(seconds));
    fd.set("startedAt", startedAt);
    fd.set("endedAt", new Date().toISOString());
    fd.set("notes", notes);
    startTransition(async () => {
      const r = await saveStudySession(fd);
      if (r.error) {
        setMessage(r.error);
        return;
      }
      setMessage("Study session saved.");
      reset();
      setNotes("");
    });
  };

  const exitSession = () => {
    if (running || seconds > 0 || notes.trim()) {
      const confirmed = window.confirm("Exit this session? Unsaved study time will be lost.");
      if (!confirmed) return;
    }
    router.push("/dashboard");
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerNav}>
          <button type="button" className={styles.backButton} onClick={() => router.back()}>
            <ArrowLeft size={15} />
            Back
          </button>
          <button type="button" className={styles.exitButton} onClick={exitSession}>
            <CircleX size={15} />
            Exit session
          </button>
        </div>
        <p>STUDY SESSIONS</p>
        <h1>Study with intention.</h1>
        <span>Track your real study time.</span>
      </header>
      <div className={styles.grid}>
        <section className={styles.card}>
          <label className={styles.label}>Topic</label>
          <select value={topicId} onChange={(e) => setTopicId(e.target.value)} disabled={running}>
            <option value="">Select a topic</option>
            {topics.map((t: any) => (
              <option key={t.id} value={t.id}>
                Unit {t.unitNumber} · {t.title}
              </option>
            ))}
          </select>
          <div className={styles.timer}>{fmt(seconds)}</div>
          <div className={styles.actions}>
            {running ? (
              <button onClick={() => setRunning(false)}>
                <Pause size={16} />Pause
              </button>
            ) : (
              <button onClick={start} disabled={!topicId || pending}>
                <Play size={16} />Start
              </button>
            )}
            <button className={styles.secondary} onClick={reset}>
              <RotateCcw size={15} />Reset
            </button>
          </div>
          <textarea className={styles.notes} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
          <button className={styles.save} onClick={save} disabled={pending || seconds < 1}>
            <Save size={15} />{pending ? "Saving…" : "Save session"}
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </section>
        <aside className={styles.card}>
          <p>RECENT SESSIONS</p>
          <h2>Study history</h2>
          {sessions.length === 0 ? (
            <div className={styles.empty}>No study sessions logged yet.</div>
          ) : (
            sessions.map((s: any) => (
              <div className={styles.row} key={s.id}>
                <span>{s.topicTitle ?? "General study"}</span>
                <b>{Math.round(s.durationSeconds / 60)} min</b>
              </div>
            ))
          )}
        </aside>
      </div>
    </main>
  );
}
