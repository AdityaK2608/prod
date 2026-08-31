import { createClient } from "@/lib/supabase/server";
import type { DashboardData } from "../types/dashboard.types";

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const metadataName = typeof user.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "";
  const name = metadataName || user.email?.split("@")[0] || "there";

  const { data: profile, error: profileError } = await supabase
    .from("user_exam_profiles")
    .select("target_exam_date, exam_variants!inner(id, paper, class_level, subject, questions, marks, duration_minutes, exam_catalog!inner(code, name))")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);

  const variant = profile?.exam_variants as any;
  const catalog = variant?.exam_catalog as any;
  let units = 0;
  let topics = 0;

  if (variant?.id) {
    const { data: unitRows, count: unitCount, error: unitError } = await supabase
      .from("exam_syllabus_units")
      .select("id", { count: "exact" })
      .eq("exam_variant_id", variant.id);
    if (unitError) throw new Error(unitError.message);

    units = unitCount ?? unitRows?.length ?? 0;
    const unitIds = (unitRows ?? []).map((row) => row.id);

    if (unitIds.length) {
      const { count: topicCount, error: topicError } = await supabase
        .from("exam_syllabus_topics")
        .select("id", { count: "exact", head: true })
        .in("unit_id", unitIds);
      if (topicError) throw new Error(topicError.message);
      topics = topicCount ?? 0;
    }
  }

  return {
    user: { name, email: user.email ?? "" },
    exam: profile && variant && catalog ? {
      name: catalog.name,
      code: catalog.code,
      paper: variant.paper,
      classLevel: variant.class_level,
      subject: variant.subject,
      questions: variant.questions,
      marks: variant.marks,
      durationMinutes: variant.duration_minutes,
      targetExamDate: profile.target_exam_date,
    } : null,
    syllabus: { units, topics },
  };
}
