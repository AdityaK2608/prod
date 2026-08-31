import { supabase } from "./supabase";

export type UserExam = {
  variantId: string;
  examName: string;
  code: string;
  paper: string;
  classLevel: string | null;
  subject: string;
  questions: number | null;
  marks: number | null;
  durationMinutes: number | null;
  targetExamDate: string | null;
};

export async function getExamOptions() {
  const { data, error } = await supabase.from("exam_variants").select("id,paper,class_level,subject,questions,marks,duration_minutes,exam_catalog!inner(code,name)").order("subject");
  if (error) throw error;
  return (data ?? []).map((row: any) => ({ id: row.id, paper: row.paper, classLevel: row.class_level, subject: row.subject, questions: row.questions, marks: row.marks, durationMinutes: row.duration_minutes, examName: row.exam_catalog?.name ?? "Exam", code: row.exam_catalog?.code ?? "" }));
}

export async function getUserExam(userId: string): Promise<UserExam | null> {
  const { data, error } = await supabase.from("user_exam_profiles").select("exam_variant_id,target_exam_date,exam_variants!inner(id,paper,class_level,subject,questions,marks,duration_minutes,exam_catalog!inner(code,name))").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const v: any = data.exam_variants; const c: any = v.exam_catalog;
  return { variantId: v.id, examName: c.name, code: c.code, paper: v.paper, classLevel: v.class_level, subject: v.subject, questions: v.questions, marks: v.marks, durationMinutes: v.duration_minutes, targetExamDate: data.target_exam_date };
}

export async function saveUserExam(userId: string, variantId: string, targetExamDate: string | null) {
  const { error } = await supabase.from("user_exam_profiles").upsert({ user_id: userId, exam_variant_id: variantId, target_exam_date: targetExamDate || null }, { onConflict: "user_id" });
  if (error) throw error;
}

export async function getSyllabus(userId: string, variantId: string) {
  const { data: units, error } = await supabase.from("exam_syllabus_units").select("id,unit_number,title,exam_syllabus_topics(id,topic_number,title,exam_topic_content(estimated_minutes,difficulty))").eq("exam_variant_id", variantId).order("unit_number");
  if (error) throw error;
  const ids = (units ?? []).flatMap((u: any) => (u.exam_syllabus_topics ?? []).map((t: any) => t.id));
  const { data: progress, error: pe } = ids.length ? await supabase.from("user_topic_progress").select("topic_id,status,confidence").eq("user_id", userId).in("topic_id", ids) : { data: [], error: null };
  if (pe) throw pe;
  const map = new Map((progress ?? []).map((p: any) => [p.topic_id, p]));
  return (units ?? []).map((u: any) => ({ id: u.id, unitNumber: u.unit_number, title: u.title, topics: (u.exam_syllabus_topics ?? []).sort((a: any,b: any)=>a.topic_number-b.topic_number).map((t: any)=>({ id:t.id, topicNumber:t.topic_number, title:t.title, status:map.get(t.id)?.status ?? "not_started", confidence:map.get(t.id)?.confidence ?? null, estimatedMinutes:t.exam_topic_content?.[0]?.estimated_minutes ?? null, difficulty:t.exam_topic_content?.[0]?.difficulty ?? null })) }));
}

export async function getTopic(userId: string, variantId: string, topicId: string) {
  const { data, error } = await supabase.from("exam_syllabus_topics").select("id,topic_number,title,exam_syllabus_units!inner(id,unit_number,title,exam_variant_id),exam_topic_content(id,topic_id,lesson_markdown,learning_objectives,key_terms,estimated_minutes,difficulty)").eq("id", topicId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const unit: any = data.exam_syllabus_units;
  if (unit.exam_variant_id !== variantId) return null;
  const { data: progress, error: pe } = await supabase.from("user_topic_progress").select("status,confidence").eq("user_id", userId).eq("topic_id", topicId).maybeSingle();
  if (pe) throw pe;
  const { data: all, error: ae } = await supabase.from("exam_syllabus_topics").select("id,topic_number,title,exam_syllabus_units!inner(exam_variant_id,unit_number)").eq("exam_syllabus_units.exam_variant_id", variantId).order("unit_number", { foreignTable: "exam_syllabus_units" }).order("topic_number");
  if (ae) throw ae;
  const ordered = (all ?? []).map((x:any)=>({id:x.id,title:x.title,unitNumber:x.exam_syllabus_units.unit_number,number:x.topic_number}));
  const i = ordered.findIndex((x:any)=>x.id===topicId);
  const content:any = data.exam_topic_content?.[0];
  return { topic:{id:data.id,title:data.title,topicNumber:data.topic_number,status:progress?.status ?? "not_started",confidence:progress?.confidence ?? null}, unit:{unitNumber:unit.unit_number,title:unit.title}, content:content ?? null, previous:i>0?ordered[i-1]:null, next:i>=0&&i<ordered.length-1?ordered[i+1]:null };
}

export async function saveProgress(userId:string, topicId:string, status:"not_started"|"in_progress"|"completed", confidence:number|null) {
  const { data: existing } = await supabase.from("user_topic_progress").select("first_started_at,completed_at,confidence").eq("user_id",userId).eq("topic_id",topicId).maybeSingle();
  const now = new Date().toISOString();
  const payload:any = { user_id:userId, topic_id:topicId, status, confidence: confidence ?? existing?.confidence ?? null, updated_at:now };
  if(status === "not_started") { payload.completed_at=null; payload.last_studied_at=null; payload.first_started_at=existing?.first_started_at ?? null; }
  else { payload.first_started_at=existing?.first_started_at ?? now; payload.last_studied_at=now; payload.completed_at=status === "completed" ? (existing?.completed_at ?? now) : null; }
  const { error } = await supabase.from("user_topic_progress").upsert(payload,{onConflict:"user_id,topic_id"});
  if(error) throw error;
}

export async function getSessions(userId:string, variantId:string) {
  const { data, error } = await supabase.from("study_sessions").select("id,topic_id,started_at,ended_at,duration_seconds,notes,exam_syllabus_topics(title)").eq("user_id",userId).eq("exam_variant_id",variantId).order("started_at",{ascending:false}).limit(30);
  if(error) throw error;
  return (data ?? []).map((s:any)=>({id:s.id,topicId:s.topic_id,topicTitle:s.exam_syllabus_topics?.title ?? "General study",startedAt:s.started_at,endedAt:s.ended_at,durationSeconds:s.duration_seconds,notes:s.notes}));
}

export async function saveSession(userId:string,variantId:string,topicId:string|null,durationSeconds:number,startedAt:string,endedAt:string,notes:string) {
  const { error } = await supabase.from("study_sessions").insert({user_id:userId,exam_variant_id:variantId,topic_id:topicId,started_at:startedAt,ended_at:endedAt,duration_seconds:durationSeconds,notes:notes.trim() || null});
  if(error) throw error;
}

export async function getDashboardStats(userId:string,variantId:string) {
  const { data: units, error: ue } = await supabase.from("exam_syllabus_units").select("id").eq("exam_variant_id",variantId);
  if(ue) throw ue;
  const unitIds=(units??[]).map((x:any)=>x.id);
  const { data: topics, error: te } = unitIds.length ? await supabase.from("exam_syllabus_topics").select("id").in("unit_id",unitIds) : {data:[],error:null};
  if(te) throw te;
  const topicIds=(topics??[]).map((x:any)=>x.id);
  const { count: completed, error: pe } = topicIds.length ? await supabase.from("user_topic_progress").select("topic_id",{count:"exact",head:true}).eq("user_id",userId).eq("status","completed").in("topic_id",topicIds) : {count:0,error:null};
  if(pe) throw pe;
  const { data:sessions, error:se } = await supabase.from("study_sessions").select("duration_seconds").eq("user_id",userId).eq("exam_variant_id",variantId);
  if(se) throw se;
  return {units:unitIds.length,topics:topicIds.length,completedTopics:completed??0,studyTimeSeconds:(sessions??[]).reduce((sum:number,s:any)=>sum+(s.duration_seconds??0),0),sessionCount:sessions?.length??0};
}
