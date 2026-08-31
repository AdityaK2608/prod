"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarDays, CheckCircle2 } from "lucide-react";
import { saveExamSetup } from "@/features/exams/exam.actions";
import "./ExamSetupPage.css";

type Props = { variantId: string; examName: string; paper: string; classLevel: string; subject: string };

export function ExamSetupPage({ variantId, examName, paper, classLevel, subject }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError("");
    const result = await saveExamSetup(new FormData(event.currentTarget));
    setPending(false);
    if (result.error) return setError(result.error);
    window.location.href = "/dashboard";
  }

  return <main className="examSetupPage"><div className="examSetupShell">
    <header className="examSetupHeader"><Link href="/" className="examSetupBrand"><img src="/preppath-logo.svg" alt="" /><span>PrepPath</span></Link><span className="examSetupStep">SET UP YOUR EXAM</span></header>
    <section className="examSetupIntro"><p className="eyebrow">FIRST STEP</p><h1>Let&apos;s build your preparation path.</h1><p className="examSetupLead">Choose the exam you&apos;re preparing for and tell us how you want to study. We&apos;ll use this to create your personal workspace.</p></section>
    <form className="setupCard" onSubmit={submit}>
      <input type="hidden" name="examVariantId" value={variantId} />
      <div className="setupProgress"><span className="active" /><span /><span /></div>
      <div className="setupSection"><div className="setupSectionHeading"><div className="setupIcon"><BookOpenCheck size={18} /></div><div><h2>Your exam</h2><p>This is the first supported exam in PrepPath.</p></div></div>
        <div className="examChoice selected"><div><strong>{examName}</strong><span>{classLevel} · {subject}</span></div><div className="choiceMeta"><span>Paper {paper}</span><CheckCircle2 size={18} /></div></div>
      </div>
      <div className="setupDivider" />
      <div className="setupSection"><div className="setupSectionHeading"><div className="setupIcon"><CalendarDays size={18} /></div><div><h2>Your preparation details</h2><p>These values belong to your account and can be changed later.</p></div></div>
        <div className="setupGrid">
          <label>Target exam date<input name="targetExamDate" type="date" /></label>
          <label>Daily study target<select name="dailyStudyMinutes" defaultValue="240"><option value="120">2 hours</option><option value="180">3 hours</option><option value="240">4 hours</option><option value="300">5 hours</option><option value="360">6 hours</option><option value="480">8 hours</option></select></label>
          <label>Preparation start date<input name="preparationStartDate" type="date" /></label>
          <label>Subject<input value={subject} readOnly /></label>
        </div>
      </div>
      {error && <p className="setupError">{error}</p>}
      <div className="setupActions"><Link href="/" className="setupBack">Back</Link><button className="setupContinue" disabled={pending}>{pending ? "Saving…" : <>Create my PrepPath <ArrowRight size={15} /></>}</button></div>
    </form>
    <footer className="setupFooter"><span>Exam data will stay connected to your account.</span><span>More exams will be added to the catalog.</span></footer>
  </div></main>;
}
