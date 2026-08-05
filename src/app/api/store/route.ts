import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

let rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

if (rawUrl.endsWith("/")) rawUrl = rawUrl.slice(0, -1);
if (rawUrl.endsWith("/rest/v1")) rawUrl = rawUrl.slice(0, -8);
if (rawUrl.endsWith("/")) rawUrl = rawUrl.slice(0, -1);

const supabaseKey = supabaseServiceKey || supabaseAnonKey;
const supabase = rawUrl && supabaseKey ? createClient(rawUrl, supabaseKey) : null;

const tableMap: Record<string, string> = {
  albums: "albums",
  testimonials: "testimonials",
  enquiries: "enquiries",
  packages: "packages",
  mediaLibrary: "media_library",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key || !supabase) return NextResponse.json({ success: false, data: [] });

    const tableName = tableMap[key];
    if (!tableName) return NextResponse.json({ success: false, data: [] });

    const { data, error } = await supabase.from(tableName).select("*");
    if (error) return NextResponse.json({ success: false, error: error.message, data: [] });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { key, value } = await req.json();
    if (!key || !value || !supabase) return NextResponse.json({ success: false, message: "Missing params or Supabase client" });

    const tableName = tableMap[key];
    if (!tableName) return NextResponse.json({ success: false, message: "Invalid key" });

    if (Array.isArray(value)) {
      if (value.length > 0) {
        const safeRecords = value.map((item: any) => {
          const clean: any = { ...item };
          if (clean.coverImage && !clean.cover_image) clean.cover_image = clean.coverImage;
          if (clean.shortDesc && !clean.short_desc) clean.short_desc = clean.shortDesc;
          if (clean.longDesc && !clean.long_desc) clean.long_desc = clean.longDesc;
          if (clean.travelDate && !clean.travel_date) clean.travel_date = clean.travelDate;
          if (clean.discountPrice && !clean.discount_price) clean.discount_price = clean.discountPrice;
          if (clean.uploadDate && !clean.upload_date) clean.upload_date = clean.uploadDate;
          return clean;
        });

        // 1. Upsert current active items
        const { error: upsertError } = await supabase.from(tableName).upsert(safeRecords);
        if (upsertError) {
          console.error(`Supabase server upsert error for ${tableName}:`, upsertError);
        }

        // 2. Reconcile and delete missing items
        const { data: dbRows } = await supabase.from(tableName).select("id");
        if (dbRows && dbRows.length > 0) {
          const currentIds = new Set(value.map((v: any) => v.id));
          const deletedIds = dbRows.filter((r: any) => !currentIds.has(r.id)).map((r: any) => r.id);
          if (deletedIds.length > 0) {
            await supabase.from(tableName).delete().in("id", deletedIds);
          }
        }
      } else {
        await supabase.from(tableName).delete().neq("id", "00000000-0000-0000-0000-000000000000");
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
