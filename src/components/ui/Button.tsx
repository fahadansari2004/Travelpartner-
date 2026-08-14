import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "amber"
  | "emerald";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

// ─── Variant Styles ───────────────────────────────────────────────────────────
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30",
  secondary:
    "bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-slate-600",
  outline:
    "border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 active:bg-amber-500/20",
  ghost:
    "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 active:bg-slate-800",
  danger:
    "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-lg shadow-red-600/20",
  amber:
    "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40",
  emerald:
    "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-lg shadow-emerald-600/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-xs gap-1 min-h-[32px]",
  sm: "h-9 px-4 text-sm gap-1.5 min-h-[36px]",
  md: "h-11 px-5 text-sm gap-2 min-h-[44px]",
  lg: "h-12 px-7 text-base gap-2 min-h-[48px]",
  xl: "h-14 px-9 text-lg gap-2.5 min-h-[56px]",
};

// ─── Component ────────────────────────────────────────────────────────────────
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-medium rounded-lg",
          "transition-all duration-200 ease-out cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          "select-none",
          // Variants & sizes
          variantStyles[variant],
          sizeStyles[size],
          // States
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin shrink-0" size={16} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
