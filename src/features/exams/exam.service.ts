import { createClient } from "@/lib/supabase/server";

const SCHEMA_MISSING_CODES = new Set(["42P01", "PGRST205", "PGRST204"]);

export async function getCurrentUserExam() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_exam_profiles")
    .select(
      "id, target_exam_date, daily_study_minutes, preparation_start_date, exam_variants!inner(paper, class_level, subject, questions, marks, duration_minutes, exam_catalog!inner(code, name, description))"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  // A freshly connected Supabase project may not have the exam foundation
  // migration applied yet. Treat that state as "no exam configured" so the
  // product can still render the onboarding experience instead of crashing.
  if (error) {
    if (SCHEMA_MISSING_CODES.has(error.code ?? "")) return null;
    throw new Error(error.message);
  }

  return data;
}

export async function getSupportedExamVariant() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exam_variants")
    .select(
      "id, paper, class_level, subject, questions, marks, duration_minutes, exam_catalog!inner(code, name, description)"
    )
    .eq("exam_catalog.code", "BIHAR_STET")
    .eq("paper", "II")
    .eq("subject", "Computer Science")
    .maybeSingle();

  if (error) {
    if (SCHEMA_MISSING_CODES.has(error.code ?? "")) return null;
    throw new Error(error.message);
  }

  return data;
}
