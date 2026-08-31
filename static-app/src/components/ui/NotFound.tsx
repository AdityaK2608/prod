import { ArrowLeft } from "lucide-react";
import { navigate } from "../../app/router";

export function NotFound() {
  return <main className="boot"><div><div className="authCopy"><span>PREPPATH</span><h2>Page not found.</h2><p>The page you requested does not exist.</p></div><button className="primary" onClick={() => navigate("/")}><ArrowLeft/> Back to PrepPath</button></div></main>;
}
