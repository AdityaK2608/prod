import { createClient } from "@/lib/supabase/server";

export async function getSyllabusData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile, error: profileError } = await supabase
    .from("user_exam_profiles")
    .select("exam_variant_id, exam_variants!inner(paper, class_level, subject, exam_catalog!inner(name))")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profileError) throw new Error(profileError.message);
  if (!profile) return null;

  const { data: units, error: unitsError } = await supabase
    .from("exam_syllabus_units")
    .select("id, unit_number, title, description, exam_syllabus_topics(id, topic_number, title, exam_topic_content(estimated_minutes, difficulty, status))")
    .eq("exam_variant_id", profile.exam_variant_id)
    .order("unit_number");
  if (unitsError) throw new Error(unitsError.message);

  const topicIds = (units ?? []).flatMap((unit: any) => (unit.exam_syllabus_topics ?? []).map((topic: any) => topic.id));
  const progress = new Map<string, { status: string; confidence: number | null }>();

  if (topicIds.length) {
    const { data: progressRows, error: progressError } = await supabase
      .from("user_topic_progress")
      .select("topic_id, status, confidence")
      .eq("user_id", user.id)
      .in("topic_id", topicIds);
    if (progressError) throw new Error(progressError.message);
    for (const row of progressRows ?? []) progress.set(row.topic_id, row);
  }

  return {
    exam: {
      name: (profile.exam_variants as any).exam_catalog.name,
      paper: (profile.exam_variants as any).paper,
      classLevel: (profile.exam_variants as any).class_level,
      subject: (profile.exam_variants as any).subject,
    },
    units: (units ?? []).map((unit: any) => ({
      ...unit,
      topics: (unit.exam_syllabus_topics ?? []).map((topic: any) => ({
        id: topic.id,
        number: topic.topic_number,
        title: topic.title,
        content: topic.exam_topic_content?.[0] ?? null,
        progress: progress.get(topic.id)?.status ?? "not_started",
        confidence: progress.get(topic.id)?.confidence ?? null,
      })),
    })),
  };
}
