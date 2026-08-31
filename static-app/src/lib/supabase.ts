import { createClient, type SupportedStorage } from "@supabase/supabase-js";

const storage: SupportedStorage = {
  getItem: (key) => window.sessionStorage.getItem(key),
  setItem: (key, value) => window.sessionStorage.setItem(key, value),
  removeItem: (key) => window.sessionStorage.removeItem(key),
};

export const supabase = createClient(
  "https://rpjjqviwznatyogedhpr.supabase.co",
  "sb_publishable_VjyDYnISRJRine3nYQheCw_aMBArpsM",
  {
    auth: {
      storage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
