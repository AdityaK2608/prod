import { redirect } from "next/navigation";
import { getSessionPageData } from "@/features/sessions/services/session.service";
import { SessionPage } from "@/components/sessions/SessionPage";

export default async function Page() {
  try {
    const data = await getSessionPageData();
    return <SessionPage topics={data.topics} sessions={data.sessions} />;
  } catch {
    redirect("/login");
  }
}
