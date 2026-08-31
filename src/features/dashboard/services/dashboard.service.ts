import { createClient } from "@/lib/supabase/server";
import type { DashboardData } from "../types/dashboard.types";

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const metadataName = typeof user.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "";
  const name = metadataName || user.email?.split("@")[0] || "there";

  return {
    user: {
      name,
      email: user.email ?? "",
    },
    exam: null,
  };
}
