import { createClient } from "@supabase/supabase-js";

// Read environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if Supabase keys are configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase client instance (or null fallback)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
