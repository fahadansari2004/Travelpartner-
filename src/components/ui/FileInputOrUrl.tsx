"use client";

import React from "react";
import { Upload, Check, Images } from "lucide-react";

/**
 * Compress and downscale uploaded base64/file images to fit comfortably within browser storage quotas.
 */
export function compressImage(
  dataUrl: string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.6
): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl.startsWith("data:image")) {
      return resolve(dataUrl);
    }

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(dataUrl);
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedUrl);
    };

    img.onerror = () => {
      resolve(dataUrl);
    };
  });
}

export function FileInputOrUrl({
  label,
  value,
  onChange,
  accept = "image/*"
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  accept?: string;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          const compressed = await compressImage(reader.result);
          onChange(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase font-semibold text-slate-300">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste web URL or click Browse File below..."
          className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
        />
        <label className="cursor-pointer px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors">
          <Upload size={14} />
          <span>Upload File from System</span>
          <input type="file" accept={accept} className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      {value && value.startsWith("data:") && (
        <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
          <Check size={12} /> Local system file attached successfully (compressed & optimized)
        </p>
      )}
      {value && (
        <div className="mt-1 h-20 w-32 rounded-lg border border-white/10 overflow-hidden bg-slate-800 relative">
          {value.startsWith("data:video") || value.endsWith(".mp4") ? (
            <video src={value} className="w-full h-full object-cover" />
          ) : (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          )}
        </div>
      )}
    </div>
  );
}

export function MultiFileInputOrUrl({
  label = "Upload Multiple Photos at Once",
  onAddMultiple,
  accept = "image/*"
}: {
  label?: string;
  onAddMultiple: (items: { url: string; name: string }[]) => void;
  accept?: string;
}) {
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const loadedItems: { url: string; name: string }[] = [];
    let readCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          const compressed = await compressImage(reader.result);
          loadedItems.push({
            url: compressed,
            name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          });
        }
        readCount++;
        if (readCount === files.length) {
          onAddMultiple(loadedItems);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase font-semibold text-amber-400">{label}</label>
      <label className="cursor-pointer px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-center">
        <Images size={18} />
        <span>Click to Select & Upload Multiple Photos from Gallery</span>
        <input
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={handleMultipleFilesChange}
        />
      </label>
    </div>
  );
}
