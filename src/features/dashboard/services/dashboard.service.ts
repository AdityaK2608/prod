import { createClient } from "@/lib/supabase/server";
import type { DashboardData } from "../types/dashboard.types";

export async function getDashboardData():Promise<DashboardData>{
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)throw new Error("Unauthorized");
 const metadataName=typeof user.user_metadata?.name==="string"?user.user_metadata.name.trim():""; const name=metadataName||user.email?.split("@")[0]||"there";
 const {data:profile,error:profileError}=await supabase.from("user_exam_profiles").select("target_exam_date, exam_variants!inner(id,paper,class_level,subject,questions,marks,duration_minutes,exam_catalog!inner(code,name))").eq("user_id",user.id).maybeSingle();
 if(profileError)throw new Error(profileError.message);
 const variant=profile?.exam_variants as any; const catalog=variant?.exam_catalog as any;
 let units=0,topics=0,completedTopics=0,studyTimeSeconds=0,sessionCount=0;
 if(variant?.id){
  const {data:unitRows,count:unitCount,error:ue}=await supabase.from("exam_syllabus_units").select("id",{count:"exact"}).eq("exam_variant_id",variant.id); if(ue)throw new Error(ue.message); units=unitCount??unitRows?.length??0;
  const unitIds=(unitRows??[]).map((r:any)=>r.id);
  if(unitIds.length){
   const {data:topicRows,count:topicCount,error:te}=await supabase.from("exam_syllabus_topics").select("id",{count:"exact"}).in("unit_id",unitIds); if(te)throw new Error(te.message); topics=topicCount??topicRows?.length??0;
   const ids=(topicRows??[]).map((r:any)=>r.id);
   if(ids.length){const {count,error:pe}=await supabase.from("user_topic_progress").select("topic_id",{count:"exact",head:true}).eq("user_id",user.id).eq("status","completed").in("topic_id",ids); if(pe)throw new Error(pe.message); completedTopics=count??0;}
  }
  const {data:sessions,error:se}=await supabase.from("study_sessions").select("duration_seconds").eq("user_id",user.id).eq("exam_variant_id",variant.id); if(se)throw new Error(se.message); sessionCount=sessions?.length??0; studyTimeSeconds=(sessions??[]).reduce((sum:number,r:any)=>sum+(r.duration_seconds??0),0);
 }
 return {user:{name,email:user.email??""},exam:profile&&variant&&catalog?{name:catalog.name,code:catalog.code,paper:variant.paper,classLevel:variant.class_level,subject:variant.subject,questions:variant.questions,marks:variant.marks,durationMinutes:variant.duration_minutes,targetExamDate:profile.target_exam_date}:null,syllabus:{units,topics,completedTopics},studyTimeSeconds,sessionCount};
}
