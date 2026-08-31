import { redirect } from "next/navigation";
import { ExamSetupPage } from "@/components/exam-setup/ExamSetupPage";
import { getCurrentUserExam, getSupportedExamVariant } from "@/features/exams/exam.service";

export default async function Page() {
  const currentExam = await getCurrentUserExam();
  if (currentExam) redirect("/dashboard");

  const variant = await getSupportedExamVariant();
  if (!variant) {
    return (
      <main className="examSetupPage">
        <div className="examSetupShell">
          <header className="examSetupHeader">
            <a className="examSetupBrand" href="/"><img src="/preppath-logo.svg" alt="" /><span>PrepPath</span></a>
          </header>
          <section className="examSetupIntro">
            <p className="eyebrow">EXAM SETUP</p>
            <h1>Your exam catalog is not ready yet.</h1>
            <p className="examSetupLead">PrepPath is connected to your account, but the exam catalog has not been initialized in the database yet. Once the Bihar STET catalog is initialized, you can continue setup here.</p>
          </section>
          <section className="setupCard">
            <div className="setupSectionHeading">
              <div className="setupIcon"><img src="/preppath-logo.svg" alt="" width="18" height="18" /></div>
              <div><h2>Bihar STET · Computer Science</h2><p>The exam definition will appear here after the Supabase exam-foundation migration is applied.</p></div>
            </div>
            <div className="setupActions"><a className="setupBack" href="/">Back to home</a></div>
          </section>
        </div>
      </main>
    );
  }

  return <ExamSetupPage variantId={variant.id} examName="Bihar STET" paper={variant.paper} classLevel={variant.class_level ?? "Class 11–12"} subject={variant.subject} />;
}
