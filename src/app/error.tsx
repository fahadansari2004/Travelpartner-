"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled App Router Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
        Something Went Wrong
      </h1>
      <p className="text-slate-400 text-sm max-w-md mt-2 leading-relaxed">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="mt-6 flex gap-4">
        <Button variant="amber" size="md" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
