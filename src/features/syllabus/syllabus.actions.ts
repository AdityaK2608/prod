"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const progressSchema = z.object({
  topicId: z.string().uuid(),
  status: z.enum(["not_started", "in_progress", "completed"]),
});

export async function updateTopicProgress(formData: FormData) {
  const parsed = progressSchema.safeParse({
    topicId: formData.get("topicId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: "Invalid topic progress update." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Please log in again." };

  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    user_id: user.id,
    topic_id: parsed.data.topicId,
    status: parsed.data.status,
    last_studied_at: now,
    updated_at: now,
  };
  if (parsed.data.status === "completed") payload.completed_at = now;

  const { error } = await supabase.from("user_topic_progress").upsert(payload, { onConflict: "user_id,topic_id" });
  if (error) return { error: error.message };
  return { success: true };
}
