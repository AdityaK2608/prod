import { createClient } from "@/lib/supabase/server";
import type { SyllabusUnit, SyllabusTopic, TopicContent, TopicDetail } from "../types/syllabus.types";

export async function getCurrentUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, user };
}

export async function getCurrentUserSyllabus(): Promise<SyllabusUnit[]> {
  const { supabase, user } = await getCurrentUserId();
  const { data: profile, error: profileError } = await supabase
    .from("user_exam_profiles")
    .select("exam_variant_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profileError) throw new Error(profileError.message);
  if (!profile?.exam_variant_id) return [];

  const { data: units, error: unitsError } = await supabase
    .from("exam_syllabus_units")
    .select("id, unit_number, title, exam_syllabus_topics(id, topic_number, title, exam_topic_content(estimated_minutes, difficulty))")
    .eq("exam_variant_id", profile.exam_variant_id)
    .order("unit_number");
  if (unitsError) throw new Error(unitsError.message);

  const topicIds = (units ?? []).flatMap((unit: any) => (unit.exam_syllabus_topics ?? []).map((topic: any) => topic.id));
  const { data: progressRows, error: progressError } = topicIds.length
    ? await supabase.from("user_topic_progress").select("topic_id, status, confidence").eq("user_id", user.id).in("topic_id", topicIds)
    : { data: [], error: null };
  if (progressError) throw new Error(progressError.message);

  const progressMap = new Map((progressRows ?? []).map((row: any) => [row.topic_id, row]));
  return (units ?? []).map((unit: any) => ({
    id: unit.id,
    unitNumber: unit.unit_number,
    title: unit.title,
    topics: (unit.exam_syllabus_topics ?? []).sort((a: any, b: any) => a.topic_number - b.topic_number).map((topic: any): SyllabusTopic => ({
      id: topic.id,
      topicNumber: topic.topic_number,
      title: topic.title,
      status: progressMap.get(topic.id)?.status ?? "not_started",
      confidence: progressMap.get(topic.id)?.confidence ?? null,
      estimatedMinutes: topic.exam_topic_content?.[0]?.estimated_minutes ?? null,
      difficulty: topic.exam_topic_content?.[0]?.difficulty ?? null,
    })),
  }));
}

export async function getTopicDetail(topicId: string): Promise<TopicDetail | null> {
  const { supabase, user } = await getCurrentUserId();
  const { data, error } = await supabase
    .from("exam_syllabus_topics")
    .select("id, topic_number, title, exam_syllabus_units!inner(id, unit_number, title, exam_variant_id), exam_topic_content(id, topic_id, lesson_markdown, learning_objectives, key_terms, estimated_minutes, difficulty)")
    .eq("id", topicId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const unit = data.exam_syllabus_units as any;
  const { data: profile, error: profileError } = await supabase.from("user_exam_profiles").select("exam_variant_id").eq("user_id", user.id).maybeSingle();
  if (profileError) throw new Error(profileError.message);
  if (!profile || profile.exam_variant_id !== unit.exam_variant_id) return null;

  const { data: progress, error: progressError } = await supabase.from("user_topic_progress").select("status, confidence, first_started_at, completed_at, last_studied_at").eq("user_id", user.id).eq("topic_id", topicId).maybeSingle();
  if (progressError) throw new Error(progressError.message);

  const { data: orderedRows, error: orderedError } = await supabase
    .from("exam_syllabus_topics")
    .select("id, topic_number, title, exam_syllabus_units!inner(exam_variant_id, unit_number)")
    .eq("exam_syllabus_units.exam_variant_id", unit.exam_variant_id)
    .order("unit_number", { foreignTable: "exam_syllabus_units", ascending: true })
    .order("topic_number", { ascending: true });
  if (orderedError) throw new Error(orderedError.message);

  const ordered = (orderedRows ?? []).map((item: any) => ({
    id: item.id,
    number: item.topic_number,
    title: item.title,
    unitNumber: item.exam_syllabus_units?.unit_number ?? 0,
  }));
  const index = ordered.findIndex((item) => item.id === topicId);
  const navigation = {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
  };

  const content = (data.exam_topic_content as any)?.[0];
  const topic: SyllabusTopic = {
    id: data.id,
    topicNumber: data.topic_number,
    title: data.title,
    status: progress?.status ?? "not_started",
    confidence: progress?.confidence ?? null,
    estimatedMinutes: content?.estimated_minutes ?? null,
    difficulty: content?.difficulty ?? null,
  };
  const topicContent: TopicContent | null = content ? {
    id: content.id,
    topicId: content.topic_id,
    lessonMarkdown: content.lesson_markdown ?? "",
    learningObjectives: content.learning_objectives ?? [],
    keyTerms: Array.isArray(content.key_terms) ? content.key_terms : [],
    estimatedMinutes: content.estimated_minutes,
    difficulty: content.difficulty,
  } : null;

  return {
    topic,
    content: topicContent,
    unit: { unitNumber: unit.unit_number, title: unit.title },
    navigation: {
      previous: navigation.previous ? { id: navigation.previous.id, number: navigation.previous.number, title: navigation.previous.title } : null,
      next: navigation.next ? { id: navigation.next.id, number: navigation.next.number, title: navigation.next.title } : null,
    },
  };
}
