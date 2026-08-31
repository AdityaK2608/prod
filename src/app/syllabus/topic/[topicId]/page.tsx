import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getTopicDetail } from "@/features/syllabus/services/syllabus.service";
import { TopicPage } from "@/components/syllabus/TopicPage";

export default async function Page({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  try {
    const data = await getTopicDetail(topicId);
    if (!data) notFound();
    return <TopicPage data={data} />;
  } catch {
    redirect("/syllabus");
  }
}
