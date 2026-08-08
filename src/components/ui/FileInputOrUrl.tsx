"use client";

import React, { useState } from "react";
import { Upload, Check, Images, Loader2, AlertCircle } from "lucide-react";

/**
 * Upload a file (or base64 dataUrl) to the server-side Supabase Storage endpoint.
 * Returns the public URL on success, or throws an error.
 */
export async function uploadToStorage(dataUrl: string, name?: string): Promise<string> {
  // If it's already an https/http URL — nothing to do
  if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
    return dataUrl;
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl, name }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || "Upload failed");
  }
  return json.url as string;
}

/**
 * Upload a raw File object via FormData to Supabase Storage.
 * Returns the public URL on success.
 */
export async function uploadFileToStorage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || "Upload failed");
  }
  return json.url as string;
}

/** Single file input — uploads directly to Supabase Storage and returns a public URL */
export function FileInputOrUrl({
  label,
  value,
  onChange,
  accept = "image/*",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const publicUrl = await uploadFileToStorage(file);
      onChange(publicUrl);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Try pasting a URL instead.");
      console.error("FileInputOrUrl upload error:", err);
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-selected
      e.target.value = "";
    }
  };

  const isStorageUrl =
    value &&
    (value.startsWith("https://ciixxtmneichewgjujbe.supabase.co") ||
      value.includes("supabase.co/storage"));
  const isExternalUrl =
    value && (value.startsWith("http://") || value.startsWith("https://")) && !isStorageUrl;

  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase font-semibold text-slate-300">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste web URL or click Upload below..."
          className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
        />
        <label
          className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors ${
            uploading
              ? "bg-slate-700/40 border-slate-500/40 text-slate-400 cursor-not-allowed"
              : "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={14} />
              <span>Upload File</span>
            </>
          )}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Success indicator */}
      {isStorageUrl && (
        <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
          <Check size={12} /> Uploaded to cloud storage ✓
        </p>
      )}
      {isExternalUrl && (
        <p className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
          <Check size={12} /> External URL linked
        </p>
      )}

      {/* Error message */}
      {uploadError && (
        <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
          <AlertCircle size={12} /> {uploadError}
        </p>
      )}

      {/* Preview */}
      {value && !uploadError && (
        <div className="mt-1 h-20 w-32 rounded-lg border border-white/10 overflow-hidden bg-slate-800 relative">
          {value.includes("video") || value.endsWith(".mp4") || value.endsWith(".webm") ? (
            <video src={value} className="w-full h-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          )}
        </div>
      )}
    </div>
  );
}

/** Multi-file input — uploads ALL files to Supabase Storage in parallel */
export function MultiFileInputOrUrl({
  label = "Upload Multiple Photos at Once",
  onAddMultiple,
  accept = "image/*",
}: {
  label?: string;
  onAddMultiple: (items: { url: string; name: string }[]) => void;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const handleMultipleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setProgress({ done: 0, total: files.length });

    try {
      const results: { url: string; name: string }[] = [];

      // Upload files one-by-one to avoid overwhelming the server
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const publicUrl = await uploadFileToStorage(file);
          const friendlyName = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ");
          results.push({ url: publicUrl, name: friendlyName });
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
        }
        setProgress({ done: i + 1, total: files.length });
      }

      if (results.length > 0) {
        onAddMultiple(results);
      } else {
        setUploadError("All uploads failed. Please check your connection.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase font-semibold text-amber-400">{label}</label>
      <label
        className={`cursor-pointer px-4 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-center ${
          uploading
            ? "bg-slate-700/40 border-slate-500/40 text-slate-400 cursor-not-allowed"
            : "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/50 text-amber-300"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>
              {progress
                ? `Uploading ${progress.done} / ${progress.total} photos...`
                : "Uploading..."}
            </span>
          </>
        ) : (
          <>
            <Images size={18} />
            <span>Click to Select &amp; Upload Multiple Photos from Gallery</span>
          </>
        )}
        <input
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={handleMultipleFilesChange}
          disabled={uploading}
        />
      </label>

      {uploadError && (
        <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
          <AlertCircle size={12} /> {uploadError}
        </p>
      )}
    </div>
  );
}
