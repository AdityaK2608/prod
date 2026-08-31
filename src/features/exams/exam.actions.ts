"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const setupSchema = z.object({
  examVariantId: z.string().uuid(),
  targetExamDate: z.string().date().optional().or(z.literal("")),
  dailyStudyMinutes: z.coerce.number().int().min(30).max(1440),
  preparationStartDate: z.string().date().optional().or(z.literal("")),
});

export async function saveExamSetup(formData: FormData) {
  const parsed = setupSchema.safeParse({
    examVariantId: formData.get("examVariantId"),
    targetExamDate: formData.get("targetExamDate"),
    dailyStudyMinutes: formData.get("dailyStudyMinutes"),
    preparationStartDate: formData.get("preparationStartDate"),
  });

  if (!parsed.success) return { error: "Please check your exam setup details." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Please log in again." };

  const { error } = await supabase.from("user_exam_profiles").upsert({
    user_id: user.id,
    exam_variant_id: parsed.data.examVariantId,
    target_exam_date: parsed.data.targetExamDate || null,
    daily_study_minutes: parsed.data.dailyStudyMinutes,
    preparation_start_date: parsed.data.preparationStartDate || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (error) return { error: error.message };
  return { success: true };
}
