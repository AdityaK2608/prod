"use server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
const schema=z.object({topicId:z.string().uuid().nullable().optional(),durationSeconds:z.coerce.number().int().min(1).max(86400),startedAt:z.string().datetime(),endedAt:z.string().datetime(),notes:z.string().trim().max(2000).nullable().optional()});
export async function saveStudySession(formData:FormData){
 const parsed=schema.safeParse({topicId:formData.get("topicId")||null,durationSeconds:formData.get("durationSeconds"),startedAt:formData.get("startedAt"),endedAt:formData.get("endedAt"),notes:formData.get("notes")||null});
 if(!parsed.success)return{error:"Invalid study session details."};
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)return{error:"Your session has expired. Please log in again."};
 const {data:profile,error:pe}=await supabase.from("user_exam_profiles").select("exam_variant_id").eq("user_id",user.id).maybeSingle(); if(pe)return{error:pe.message}; if(!profile?.exam_variant_id)return{error:"Set up an exam before logging study time."};
 if(new Date(parsed.data.endedAt)<=new Date(parsed.data.startedAt))return{error:"Study session end time must be after the start time."};
 if(parsed.data.topicId){const {data:topic,error:te}=await supabase.from("exam_syllabus_topics").select("id, exam_syllabus_units!inner(exam_variant_id)").eq("id",parsed.data.topicId).maybeSingle(); if(te)return{error:te.message}; if(!topic||((topic.exam_syllabus_units as any)?.exam_variant_id!==profile.exam_variant_id))return{error:"Selected topic is not part of your exam."};}
 const {error}=await supabase.from("study_sessions").insert({user_id:user.id,exam_variant_id:profile.exam_variant_id,topic_id:parsed.data.topicId??null,started_at:parsed.data.startedAt,ended_at:parsed.data.endedAt,duration_seconds:parsed.data.durationSeconds,notes:parsed.data.notes??null});
 return error?{error:error.message}:{success:true};
}
