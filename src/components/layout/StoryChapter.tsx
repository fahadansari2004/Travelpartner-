"use client";

import { ReactNode, memo } from "react";
import { cn } from "@/lib/utils";

interface StoryChapterProps {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  children: ReactNode;
  className?: string;
  pinned?: boolean;
}

export const StoryChapter = memo(function StoryChapter({
  id,
  chapterNumber,
  chapterTitle,
  children,
  className,
  pinned = false,
}: StoryChapterProps) {
  return (
    <section
      id={id}
      data-chapter={chapterNumber}
      className={cn(
        "relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8",
        pinned && "sticky top-0 z-10",
        className
      )}
    >
      {/* Chapter Indicator Header */}
      <div className="w-full max-w-7xl mx-auto mb-6 flex items-center justify-between pointer-events-none opacity-80">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
            CHAPTER {String(chapterNumber).padStart(2, "0")} ✦ {chapterTitle}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500">
          SCENIC STORY MODE
        </span>
      </div>

      {/* Chapter Overlay Content */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        {children}
      </div>
    </section>
  );
});
