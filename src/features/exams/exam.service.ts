import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserExam() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_exam_profiles")
    .select("id, target_exam_date, daily_study_minutes, preparation_start_date, exam_variants!inner(paper, class_level, subject, questions, marks, duration_minutes, exam_catalog!inner(code, name, description))")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getSupportedExamVariant() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exam_variants")
    .select("id, paper, class_level, subject, questions, marks, duration_minutes, exam_catalog!inner(code, name, description)")
    .eq("exam_catalog.code", "BIHAR_STET")
    .eq("paper", "II")
    .eq("subject", "Computer Science")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
