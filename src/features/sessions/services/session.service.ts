import { createClient } from "@/lib/supabase/server";
import type { StudyTopicOption, StudySession } from "../types/session.types";

export async function getSessionPageData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile, error: profileError } = await supabase
    .from("user_exam_profiles")
    .select("exam_variant_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profileError) throw new Error(profileError.message);
  if (!profile?.exam_variant_id) return { topics: [] as StudyTopicOption[], sessions: [] as StudySession[] };

  const { data: rows, error } = await supabase
    .from("exam_syllabus_topics")
    .select("id, topic_number, title, exam_syllabus_units!inner(unit_number, exam_variant_id)")
    .eq("exam_syllabus_units.exam_variant_id", profile.exam_variant_id);
  if (error) throw new Error(error.message);

  const topics = (rows ?? [])
    .map((row: any) => ({ id: row.id, title: row.title, unitNumber: row.exam_syllabus_units.unit_number, topicNumber: row.topic_number }))
    .sort((a, b) => a.unitNumber - b.unitNumber || a.topicNumber - b.topicNumber);

  const { data: sessions, error: sessionError } = await supabase
    .from("study_sessions")
    .select("id, started_at, ended_at, duration_seconds, notes, exam_syllabus_topics(title)")
    .eq("user_id", user.id)
    .eq("exam_variant_id", profile.exam_variant_id)
    .order("started_at", { ascending: false })
    .limit(20);
  if (sessionError) throw new Error(sessionError.message);

  const mapped = (sessions ?? []).map((row: any) => ({
    id: row.id,
    topicTitle: row.exam_syllabus_topics?.title ?? null,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    durationSeconds: row.duration_seconds,
    notes: row.notes,
  }));

  return { topics, sessions: mapped };
}
