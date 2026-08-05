import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "amber"
  | "purple"
  | "cyan"
  | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  "bg-slate-800 text-slate-300 border border-slate-700",
  success:  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  warning:  "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  danger:   "bg-red-500/15 text-red-400 border border-red-500/30",
  info:     "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  amber:    "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  purple:   "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  cyan:     "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
  outline:  "border border-slate-600 text-slate-400 bg-transparent",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
  lg: "text-sm px-3 py-1",
};

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === "success" && "bg-emerald-400",
            variant === "warning" && "bg-yellow-400",
            variant === "danger"  && "bg-red-400",
            variant === "info"    && "bg-blue-400",
            variant === "amber"   && "bg-amber-400",
            variant === "purple"  && "bg-purple-400",
            variant === "default" && "bg-slate-400",
          )}
        />
      )}
      {children}
    </span>
  );
}
