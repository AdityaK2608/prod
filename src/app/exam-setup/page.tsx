import { redirect } from "next/navigation";
import { ExamSetupPage } from "@/components/exam-setup/ExamSetupPage";
import { getCurrentUserExam, getSupportedExamVariant } from "@/features/exams/exam.service";

export default async function Page() {
  const currentExam = await getCurrentUserExam();
  if (currentExam) redirect("/dashboard");
  const variant = await getSupportedExamVariant();
  if (!variant) throw new Error("Bihar STET Computer Science exam data is not configured.");
  return <ExamSetupPage variantId={variant.id} examName="Bihar STET" paper={variant.paper} classLevel={variant.class_level ?? "Class 11–12"} subject={variant.subject} />;
}
