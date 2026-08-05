import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://ciixxtmneichewgjujbe.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_IzWYI8X4GgnLXIg__LNJIg_tSA0ZaE5";

// Read environment variables for Supabase with hardcoded production fallback
let rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

// Automatically sanitize URL if user pasted trailing /rest/v1 or slashes
if (rawUrl.endsWith("/")) rawUrl = rawUrl.slice(0, -1);
if (rawUrl.endsWith("/rest/v1")) rawUrl = rawUrl.slice(0, -8);
if (rawUrl.endsWith("/")) rawUrl = rawUrl.slice(0, -1);

export const supabaseUrl = rawUrl;

// Check if Supabase keys are configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase client instance (or null fallback)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
