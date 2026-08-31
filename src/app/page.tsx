import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { HomeAuthPanel } from "@/components/home/HomeAuthPanel";
import { getCurrentUserExam } from "@/features/exams/exam.service";
import { createClient } from "@/lib/supabase/server";
import "./home.css";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect((await getCurrentUserExam()) ? "/dashboard" : "/exam-setup");

  return <main className="landingPage">
    <div className="landingTopbar">
      <a className="landingBrand" href="/"><img src="/preppath-logo.svg" alt="PrepPath" /><span>PrepPath</span></a>
      <span className="landingTag">EXAM PREPARATION, ORGANIZED</span>
    </div>

    <section className="landingGrid">
      <div className="landingHero">
        <div className="badge"><span className="dot" /> Built for students & aspirants</div>
        <h1>Prepare with a plan.<br /><span>Progress with purpose.</span></h1>
        <p>One focused workspace for your syllabus, study time, revision, tests, and progress — organized around the exam you are actually preparing for.</p>
        <div className="landingPoints">
          <div><BookOpen size={15}/><span>Track your syllabus</span></div>
          <div><CalendarDays size={15}/><span>Build a study plan</span></div>
          <div><Clock3 size={15}/><span>Measure real study time</span></div>
          <div><CheckCircle2 size={15}/><span>Stay ahead of revision</span></div>
        </div>
        <div className="landingBottom"><span>Starting with Bihar STET · Computer Science</span><a href="#auth">Get started <ArrowRight size={14}/></a></div>
      </div>
      <div id="auth" className="landingAuth"><HomeAuthPanel /></div>
    </section>

    <footer className="landingFooter"><span>© 2026 PrepPath</span><span>Free to start · More exams coming soon</span></footer>
  </main>;
}
