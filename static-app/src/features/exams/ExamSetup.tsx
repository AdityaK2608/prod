import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { getExamOptions, saveUserExam } from "../../lib/data";
import { navigate } from "../../app/router";
import type { SessionUser } from "../../types/app";

export function ExamSetup({ user }: { user: SessionUser }) {
  const [options, setOptions] = useState<any[]>([]);
  const [variant, setVariant] = useState("");
  const [date, setDate] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getExamOptions().then(setOptions).catch(err => setError(err instanceof Error ? err.message : "Unable to load exams.")); }, []);

  async function save() {
    setPending(true); setError("");
    try { await saveUserExam(user.id, variant, date || null); navigate("/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to save exam setup."); }
    finally { setPending(false); }
  }

  const selected = options.find(option => option.id === variant);
  return <AppShell user={user} active="exam"><div className="centerWrap">
    <div className="setupHead"><button className="backPlain" onClick={() => navigate("/dashboard")}><ArrowLeft/>Back</button><span>EXAM SETUP</span><h1>Build your preparation path.</h1><p>Choose the exam you are preparing for. Your dashboard will be built from this selection.</p></div>
    <section className="setupCard"><label>Exam</label><select value={variant} onChange={e => setVariant(e.target.value)}><option value="">Select your exam</option>{options.map(option => <option key={option.id} value={option.id}>{option.examName} · Paper {option.paper} · {option.subject}</option>)}</select>
      {selected && <div className="examPreview"><strong>{selected.examName}</strong><span>Paper {selected.paper} · {selected.subject} · {selected.questions ?? "—"} questions · {selected.marks ?? "—"} marks</span></div>}
      <label>Target exam date <small>Optional</small></label><input type="date" value={date} onChange={e => setDate(e.target.value)}/>{error && <div className="alert error">{error}</div>}
      <button className="primary full" onClick={save} disabled={!variant || pending}>{pending ? "Saving…" : "Save exam setup"}</button>
    </section>
  </div></AppShell>;
}
