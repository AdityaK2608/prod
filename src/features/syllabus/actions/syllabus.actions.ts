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

  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    user_id: user.id,
    topic_id: parsed.data.topicId,
    status: parsed.data.status,
    confidence: parsed.data.confidence ?? null,
    last_studied_at: now,
    updated_at: now,
  };

  if (parsed.data.status === "in_progress") payload.first_started_at = now;
  if (parsed.data.status === "completed") {
    payload.completed_at = now;
    payload.first_started_at = now;
  }

  const { error } = await supabase.from("user_topic_progress").upsert(payload, { onConflict: "user_id,topic_id" });
  if (error) return { error: error.message };
  return { success: true };
}
