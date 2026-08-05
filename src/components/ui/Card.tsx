import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─── Card ─────────────────────────────────────────────────────────────────────
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
}

export function Card({ glass = false, hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden",
        glass ? "glass-card" : "bg-slate-900 border border-slate-800",
        hover && "card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── CardHeader ───────────────────────────────────────────────────────────────
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-0", className)} {...props}>
      {children}
    </div>
  );
}

// ─── CardTitle ────────────────────────────────────────────────────────────────
export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-xl font-semibold text-slate-50 font-[family-name:var(--font-playfair)]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

// ─── CardDescription ──────────────────────────────────────────────────────────
export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-400 mt-1.5 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

// ─── CardContent ──────────────────────────────────────────────────────────────
export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

// ─── CardFooter ───────────────────────────────────────────────────────────────
export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-slate-800/60 flex items-center gap-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
