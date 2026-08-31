"use client";
import { useEffect, useState, useTransition } from "react";
import { ArrowLeft, CircleX, Pause, Play, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveStudySession } from "@/features/sessions/actions/session.actions";
import styles from "./SessionPage.module.css";

type Props = {
  topics: Array<{ id: string; unitNumber: number; topicNumber: number; title: string }>;
  sessions: Array<{ id: string; topicTitle: string | null; durationSeconds: number; startedAt: string; endedAt: string; notes: string | null }>;
};

export function SessionPage({ topics, sessions }: Props) {
  const router = useRouter();
  const [topicId, setTopicId] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [runStartedAtMs, setRunStartedAtMs] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!running || runStartedAtMs === null) return;
    const tick = () => {
      setSeconds((previous) => previous + Math.max(0, Math.floor((Date.now() - runStartedAtMs) / 1000) - previous + seconds));
    };
    const id = window.setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, runStartedAtMs]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const start = () => {
    const now = Date.now();
    setStartedAt((value) => value ?? new Date(now).toISOString());
    setRunStartedAtMs(now);
    setRunning(true);
    setMessage("");
  };

  const pause = () => {
    setRunning(false);
    setRunStartedAtMs(null);
  };

  const reset = () => {
    setRunning(false);
    setSeconds(0);
    setStartedAt(null);
    setRunStartedAtMs(null);
    setMessage("");
  };

  const confirmLeave = () => {
    if (running || seconds > 0 || notes.trim()) {
      return window.confirm("Leave this session? Unsaved study time will be lost.");
    }
    return true;
  };

  const goBack = () => {
    if (confirmLeave()) router.back();
  };

  const exitSession = () => {
    if (confirmLeave()) router.push("/dashboard");
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
      const result = await saveStudySession(fd);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setRunning(false);
      setSeconds(0);
      setStartedAt(null);
      setRunStartedAtMs(null);
      setNotes("");
      setMessage("Study session saved.");
    });
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerNav}>
          <button type="button" className={styles.backButton} onClick={goBack} disabled={pending}>
            <ArrowLeft size={15} />
            Back
          </button>
          <button type="button" className={styles.exitButton} onClick={exitSession} disabled={pending}>
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
          <select value={topicId} onChange={(e) => setTopicId(e.target.value)} disabled={running || pending}>
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                Unit {topic.unitNumber} · {topic.title}
              </option>
            ))}
          </select>

          <div className={styles.timer}>{fmt(seconds)}</div>

          <div className={styles.actions}>
            {running ? (
              <button type="button" onClick={pause} disabled={pending}>
                <Pause size={16} />Pause
              </button>
            ) : (
              <button type="button" onClick={start} disabled={!topicId || pending}>
                <Play size={16} />{seconds > 0 ? "Resume" : "Start"}
              </button>
            )}
            <button type="button" className={styles.secondary} onClick={reset} disabled={pending}>
              <RotateCcw size={15} />Reset
            </button>
          </div>

          <textarea
            className={styles.notes}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
            disabled={pending}
          />

          <button type="button" className={styles.save} onClick={save} disabled={pending || seconds < 1}>
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
            sessions.map((session) => (
              <div className={styles.row} key={session.id}>
                <span>{session.topicTitle ?? "General study"}</span>
                <b>{Math.round(session.durationSeconds / 60)} min</b>
              </div>
            ))
          )}
        </aside>
      </div>
    </main>
  );
}
