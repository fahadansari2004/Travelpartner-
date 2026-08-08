import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const DEFAULT_SUPABASE_URL = "https://ciixxtmneichewgjujbe.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_IzWYI8X4GgnLXIg__LNJIg_tSA0ZaE5";

let rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

if (rawUrl.endsWith("/")) rawUrl = rawUrl.slice(0, -1);
if (rawUrl.endsWith("/rest/v1")) rawUrl = rawUrl.slice(0, -8);
if (rawUrl.endsWith("/")) rawUrl = rawUrl.slice(0, -1);

// Use service key for storage operations (needed for bucket creation)
const supabaseKey = supabaseServiceKey || supabaseAnonKey;
const supabase = createClient(rawUrl, supabaseKey);

const BUCKET_NAME = "media";

/** Ensure the media bucket exists with public access */
async function ensureBucket() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET_NAME);

    if (!exists) {
      // Create public bucket
      const { error: createErr } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ["image/*", "video/*"],
        fileSizeLimit: 52428800, // 50MB
      });
      if (createErr && !createErr.message?.includes("already exists")) {
        console.error("Bucket creation error:", createErr);
      }
    }
  } catch (e) {
    console.warn("ensureBucket warning:", e);
  }
}

/**
 * Convert a base64 data URL to a Buffer + MIME type
 */
function base64ToBuffer(dataUrl: string): { buffer: Buffer; mimeType: string; ext: string } | null {
  try {
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) return null;
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");
    const extMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/ogg": "ogv",
    };
    const ext = extMap[mimeType] || "jpg";
    return { buffer, mimeType, ext };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    await ensureBucket();

    const contentType = req.headers.get("content-type") || "";

    let fileBuffer: Buffer | null = null;
    let mimeType = "image/jpeg";
    let ext = "jpg";
    let originalName = `upload-${Date.now()}`;

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData file upload
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
      }
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      mimeType = file.type || "image/jpeg";
      originalName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
      ext = file.name.split(".").pop() || "jpg";
    } else {
      // Handle JSON with base64 data URL
      const body = await req.json();
      const { dataUrl, name } = body;

      if (!dataUrl) {
        return NextResponse.json({ success: false, error: "No dataUrl provided" }, { status: 400 });
      }

      if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
        // Already a URL — return as-is
        return NextResponse.json({ success: true, url: dataUrl });
      }

      const parsed = base64ToBuffer(dataUrl);
      if (!parsed) {
        return NextResponse.json({ success: false, error: "Invalid base64 data URL" }, { status: 400 });
      }
      fileBuffer = parsed.buffer;
      mimeType = parsed.mimeType;
      ext = parsed.ext;
      if (name) originalName = name.replace(/[^a-zA-Z0-9_-]/g, "_");
    }

    if (!fileBuffer) {
      return NextResponse.json({ success: false, error: "No file data" }, { status: 400 });
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomSuffix}-${originalName}.${ext}`;
    const filePath = `uploads/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData.publicUrl;

    return NextResponse.json({ success: true, url: publicUrl, path: uploadData.path });
  } catch (err: any) {
    console.error("Upload API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** Health check */
export async function GET() {
  return NextResponse.json({ success: true, message: "Upload API is ready" });
}
