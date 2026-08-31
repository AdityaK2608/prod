import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { getUserExam } from "./lib/data";
import { getRoute, navigate } from "./app/router";
import { AuthScreen } from "./features/auth/AuthScreen";
import { Dashboard } from "./features/dashboard/Dashboard";
import { ExamSetup } from "./features/exams/ExamSetup";
import { Syllabus } from "./features/syllabus/Syllabus";
import { Topic } from "./features/topics/Topic";
import { Sessions } from "./features/sessions/Sessions";
import { NotFound } from "./components/ui/NotFound";
import type { SessionUser } from "./types/app";
import "./styles.css";

function HomeRouter({ user }: { user: SessionUser }) {
  const [error, setError] = useState("");
  useEffect(() => {
    getUserExam(user.id)
      .then(exam => navigate(exam ? "/dashboard" : "/exam-setup"))
      .catch(err => setError(err instanceof Error ? err.message : "Unable to load your preparation."));
  }, [user.id]);
  if (error) return <div className="boot"><div><strong>Unable to load your preparation.</strong><p>{error}</p><button className="primary" onClick={() => window.location.reload()}>Try again</button></div></div>;
  return <div className="boot">Loading your preparation…</div>;
}

function AppRouter({ user }: { user: SessionUser }) {
  const path = getRoute();
  if (path === "/") return <HomeRouter user={user} />;
  if (path === "/dashboard") return <Dashboard user={user} />;
  if (path === "/exam-setup") return <ExamSetup user={user} />;
  if (path === "/syllabus") return <Syllabus user={user} />;
  if (path === "/sessions") return <Sessions user={user} />;
  if (path.startsWith("/topic/")) {
    const topicId = path.slice("/topic/".length).split("/")[0];
    return topicId ? <Topic user={user} topicId={topicId} /> : <NotFound />;
  }
  return <NotFound />;
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onHash = () => window.dispatchEvent(new Event("preppath-route"));
    const onRoute = () => setSession(current => current);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("preppath-route", onRoute);
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("preppath-route", onRoute); data.subscription.unsubscribe(); };
  }, []);

  if (loading) return <div className="boot"><div className="brandMark">P</div><span>Loading PrepPath…</span></div>;
  if (!session) return <AuthScreen />;
  return <AppRouter user={session.user} />;
}
