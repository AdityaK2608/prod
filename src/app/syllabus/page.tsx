import { redirect } from "next/navigation";
import { getSyllabusData } from "@/features/syllabus/syllabus.service";
import { SyllabusPage } from "@/components/syllabus/SyllabusPage";
import "./syllabus.css";

export default async function Page() {
  const data = await getSyllabusData();
  if (!data) redirect("/exam-setup");
  return <SyllabusPage exam={data.exam} units={data.units} />;
}
