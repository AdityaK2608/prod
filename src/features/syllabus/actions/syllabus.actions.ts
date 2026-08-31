"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const progressSchema = z.object({
  topicId: z.string().uuid(),
  status: z.enum(["not_started", "in_progress", "completed"]),
  confidence: z.coerce.number().int().min(1).max(5).nullable().optional(),
});

export async function saveTopicProgress(formData: FormData) {
  const parsed = progressSchema.safeParse({
    topicId: formData.get("topicId"),
    status: formData.get("status"),
    confidence: formData.get("confidence") ? Number(formData.get("confidence")) : null,
  });
  if (!parsed.success) return { error: "Invalid progress details." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Please log in again." };

  // Only allow progress updates for a topic belonging to the user's selected exam.
  const { data: topic, error: topicError } = await supabase
    .from("exam_syllabus_topics")
    .select("id, exam_syllabus_units!inner(exam_variant_id)")
    .eq("id", parsed.data.topicId)
    .maybeSingle();
  if (topicError) return { error: topicError.message };
  if (!topic) return { error: "Topic not found." };

  const variant = topic.exam_syllabus_units as any;
  const { data: profile, error: profileError } = await supabase
    .from("user_exam_profiles")
    .select("exam_variant_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profileError) return { error: profileError.message };
  if (!profile || profile.exam_variant_id !== variant.exam_variant_id) return { error: "This topic is not part of your selected exam." };

  const { data: existing, error: existingError } = await supabase
    .from("user_topic_progress")
    .select("first_started_at, completed_at")
    .eq("user_id", user.id)
    .eq("topic_id", parsed.data.topicId)
    .maybeSingle();
  if (existingError) return { error: existingError.message };

  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    user_id: user.id,
    topic_id: parsed.data.topicId,
    status: parsed.data.status,
    confidence: parsed.data.confidence ?? null,
    updated_at: now,
  };

  if (parsed.data.status === "not_started") {
    payload.first_started_at = existing?.first_started_at ?? null;
    payload.completed_at = null;
    // Resetting a topic means it is no longer the most recently studied item.
    payload.last_studied_at = null;
  } else {
    payload.last_studied_at = now;
    payload.first_started_at = existing?.first_started_at ?? now;
    payload.completed_at = parsed.data.status === "completed" ? (existing?.completed_at ?? now) : null;
  }

  const { error } = await supabase
    .from("user_topic_progress")
    .upsert(payload, { onConflict: "user_id,topic_id" });
  if (error) return { error: error.message };
  return { success: true };
}
