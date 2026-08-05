"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export const MasterCanvasDynamic = dynamic(
  () => import("./MasterCanvas").then((mod) => mod.MasterCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-0 flex flex-col items-center justify-center bg-slate-950 pointer-events-none gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <span className="text-xs uppercase tracking-widest font-medium font-[family-name:var(--font-playfair)] text-slate-500">
          Initializing 3D World...
        </span>
      </div>
    ),
  }
);
