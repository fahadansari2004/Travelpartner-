import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_SUPABASE_URL = "https://ciixxtmneichewgjujbe.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_IzWYI8X4GgnLXIg__LNJIg_tSA0ZaE5";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim().replace(/\/$/, '').replace(/\/rest\/v1$/, '').replace(/\/$/, '');
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

// Run ALTER TABLE via Supabase Management API
// Since we use anon key, we run DDL via a stored function approach or pg_net
// Instead, we handle this via REST with the "exec" pattern
export async function GET() {
  const results: string[] = [];
  
  // Use pg_net or direct REST to alter table - try multiple approaches
  const migrations = [
    "ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 1",
    "ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now()",
  ];

  for (const sql of migrations) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      });
      const text = await res.text();
      results.push(`SQL: ${sql.slice(0, 50)}... -> ${res.status}: ${text.slice(0, 100)}`);
    } catch (e: any) {
      results.push(`ERROR: ${e.message}`);
    }
  }

  return NextResponse.json({ results });
}
