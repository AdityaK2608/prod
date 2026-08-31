"use client";
import { useEffect, useState, useTransition } from "react";
import { ArrowLeft, BookOpen, CircleX, Clock3, Pause, Play, RotateCcw, Save } from "lucide-react";
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
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const start = () => {
    if (!startedAt) setStartedAt(new Date().toISOString());
    setRunning(true);
    setMessage("");
  };

  const pause = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setSeconds(0);
    setStartedAt(null);
    setNotes("");
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
      reset();
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
        <span>Focus on one topic, track the time, and build a repeatable study habit.</span>
      </header>

      <div className={styles.grid}>
        <section className={`${styles.card} ${styles.timerCard}`}>
          <p className={styles.cardEyebrow}>FOCUSED STUDY</p>
          <h2 className={styles.cardTitle}>{topicId ? "Your session" : "Choose what you're studying"}</h2>
          <label className={styles.label} htmlFor="study-topic">Syllabus topic</label>
          <select id="study-topic" value={topicId} onChange={(e) => setTopicId(e.target.value)} disabled={running || pending}>
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>Unit {topic.unitNumber} · {topic.title}</option>
            ))}
          </select>

          <div className={styles.timerStage}>
            <div className={styles.timer}>{fmt(seconds)}</div>
            <div className={styles.timerStatus}>
              <span className={`${styles.statusDot} ${running ? styles.live : ""}`} />
              {running ? "Session in progress" : seconds > 0 ? "Session paused" : "Ready to start"}
            </div>
          </div>

          <div className={styles.actions}>
            {running ? (
              <button type="button" onClick={pause} disabled={pending}>
                <Pause size={16} /> Pause
              </button>
            ) : (
              <button type="button" onClick={start} disabled={!topicId || pending}>
                <Play size={16} /> {seconds > 0 ? "Resume" : "Start session"}
              </button>
            )}
            <button type="button" className={styles.secondary} onClick={reset} disabled={pending || (seconds === 0 && !notes)}>
              <RotateCcw size={15} /> Reset
            </button>
          </div>

          <textarea className={styles.notes} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes — what did you cover, practise, or struggle with?" disabled={pending} />
          <button type="button" className={styles.save} onClick={save} disabled={pending || seconds < 1}>
            <Save size={15} /> {pending ? "Saving…" : "Save study session"}
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </section>

        <aside className={`${styles.card} ${styles.historyCard}`}>
          <div className={styles.historyHeader}>
            <div>
              <p className={styles.cardEyebrow}>YOUR ACTIVITY</p>
              <h2>Recent sessions</h2>
              <div className={styles.historyMeta}>Your latest saved study time</div>
            </div>
            <div className={styles.historyIcon}><BookOpen size={17} /></div>
          </div>

          {sessions.length === 0 ? (
            <div className={styles.empty}>Your saved sessions will appear here once you complete your first study block.</div>
          ) : (
            sessions.map((session) => (
              <div className={styles.row} key={session.id}>
                <div className={styles.rowTop}>
                  <strong className={styles.rowTopic}>{session.topicTitle ?? "General study"}</strong>
                  <b className={styles.rowDuration}>{Math.round(session.durationSeconds / 60)} min</b>
                </div>
                <div className={styles.rowSub}>
                  {new Date(session.startedAt).toLocaleDateString()} · {new Date(session.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))
          )}
        </aside>
      </div>
    </main>
  );
}
