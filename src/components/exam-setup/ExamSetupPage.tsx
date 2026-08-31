"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarDays, CheckCircle2 } from "lucide-react";
import "./ExamSetupPage.css";

export function ExamSetupPage() {
  return (
    <main className="examSetupPage">
      <div className="examSetupShell">
        <header className="examSetupHeader">
          <Link href="/" className="examSetupBrand">
            <img src="/preppath-logo.svg" alt="" />
            <span>PrepPath</span>
          </Link>
          <span className="examSetupStep">EXAM SETUP · 01</span>
        </header>

        <section className="examSetupIntro">
          <p className="eyebrow">BUILD YOUR PREPARATION PATH</p>
          <h1>Tell us what you&apos;re preparing for.</h1>
          <p className="examSetupLead">We&apos;ll use this information to build your syllabus, study plan, revision schedule, and progress dashboard.</p>
        </section>

        <section className="setupCard">
          <div className="setupProgress"><span className="active" /><span /><span /></div>

          <div className="setupSection">
            <div className="setupSectionHeading"><div className="setupIcon"><BookOpenCheck size={18} /></div><div><h2>Select your exam</h2><p>PrepPath currently starts with Bihar STET Computer Science.</p></div></div>
            <div className="examChoice selected"><div><strong>Bihar STET</strong><span>Secondary Teacher Eligibility Test</span></div><div className="choiceMeta"><span>Paper II</span><CheckCircle2 size={18} /></div></div>
          </div>

          <div className="setupDivider" />

          <div className="setupSection">
            <div className="setupSectionHeading"><div className="setupIcon"><CalendarDays size={18} /></div><div><h2>Set your preparation details</h2><p>These values are personal to your preparation and can be changed later.</p></div></div>
            <div className="setupGrid">
              <label>Subject<input value="Computer Science" readOnly /></label>
              <label>Target exam date<input type="date" /></label>
              <label>Daily study target<select defaultValue="4"><option value="2">2 hours</option><option value="3">3 hours</option><option value="4">4 hours</option><option value="5">5 hours</option><option value="6">6 hours</option><option value="8">8 hours</option></select></label>
              <label>Preparation start date<input type="date" /></label>
            </div>
          </div>

          <div className="setupActions"><Link href="/dashboard" className="setupBack">Back to dashboard</Link><button className="setupContinue">Continue <ArrowRight size={15} /></button></div>
        </section>

        <footer className="setupFooter"><span>Nothing is final yet.</span><span>You can update your exam settings later.</span></footer>
      </div>
    </main>
  );
}
