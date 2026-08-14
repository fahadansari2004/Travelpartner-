import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Section Types ────────────────────────────────────────────────────────────
export type SectionPadding = "none" | "sm" | "md" | "lg" | "xl" | "hero";
export type SectionBackground =
  | "transparent"
  | "slate-950"
  | "slate-900"
  | "glass"
  | "hero"
  | "gradient-dark";
export type SectionContainerWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "narrow";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  fullScreen?: boolean;
  center?: boolean;
  padding?: SectionPadding;
  background?: SectionBackground;
  containerWidth?: SectionContainerWidth;
  noise?: boolean;
  glow?: "none" | "amber" | "blue" | "cool" | "purple";
  borderBottom?: boolean;
  borderTop?: boolean;
  as?: "section" | "article" | "div" | "aside" | "main";
}

const paddingStyles: Record<SectionPadding, string> = {
  none: "py-0",
  sm:   "py-8 md:py-12",
  md:   "py-12 md:py-16",
  lg:   "py-16 md:py-24",
  xl:   "py-20 md:py-32",
  hero: "pt-28 pb-20 md:pt-36 md:pb-28",
};



const backgroundStyles: Record<SectionBackground, string> = {
  transparent:     "bg-transparent",
  "slate-950":     "bg-slate-950/60 backdrop-blur-md",
  "slate-900":     "bg-slate-900/60 backdrop-blur-md",
  glass:           "glass border-y border-white/5",
  hero:            "bg-slate-950/40 backdrop-blur-[2px]",
  "gradient-dark": "section-gradient bg-slate-950/70 backdrop-blur-md",
};

const containerWidthStyles: Record<SectionContainerWidth, string> = {
  sm:     "max-w-3xl",
  md:     "max-w-4xl",
  lg:     "max-w-5xl",
  xl:     "max-w-6xl",
  "2xl":  "max-w-7xl",
  narrow: "max-w-2xl",
  full:   "max-w-full px-0",
};

// ─── Root Section Component ───────────────────────────────────────────────────
export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      fullScreen = false,
      center = false,
      padding = "lg",
      background = "slate-950",
      containerWidth = "2xl",
      noise = false,
      glow = "none",
      borderBottom = false,
      borderTop = false,
      as: Tag = "section",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Tag
        ref={ref as unknown as React.Ref<HTMLDivElement>}
        className={cn(
          "relative overflow-hidden w-full transition-colors duration-300",
          fullScreen && "min-h-screen flex flex-col justify-center",
          paddingStyles[padding],
          backgroundStyles[background],
          noise && "noise-overlay",
          borderTop && "border-t border-slate-800/60",
          borderBottom && "border-b border-slate-800/60",
          className
        )}
        {...props}
      >
        {/* Glow backdrop effects */}
        {glow === "amber" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 70%)",
            }}
          />
        )}
        {glow === "blue" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
            }}
          />
        )}
        {glow === "purple" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
            }}
          />
        )}

        {/* Outer Container */}
        <div
          className={cn(
            "relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8",
            containerWidthStyles[containerWidth],
            center && "flex flex-col items-center text-center"
          )}
        >
          {children}
        </div>
      </Tag>
    );
  }
);

Section.displayName = "Section";

// ─── Section Header Subcomponent ──────────────────────────────────────────────
export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  align?: "left" | "center" | "right" | "between";
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  gradientTitle?: boolean;
}

export function SectionHeader({
  align = "left",
  eyebrow,
  title,
  subtitle,
  action,
  gradientTitle = false,
  className,
  children,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" && "text-center mx-auto max-w-3xl flex flex-col items-center",
        align === "right" && "text-right ml-auto",
        align === "between" && "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
        className
      )}
      {...props}
    >
      <div className={cn(align === "between" && "max-w-2xl")}>
        {eyebrow && <div className="mb-3">{eyebrow}</div>}
        {title && (
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-[family-name:var(--font-playfair)]">
            {typeof title === "string" && gradientTitle ? (
              <span className="gradient-text">{title}</span>
            ) : (
              title
            )}
          </h2>
        )}
        {subtitle && (
          <p className="mt-3 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}

      {children}
    </div>
  );
}

// ─── Section Grid Subcomponent ────────────────────────────────────────────────
export interface SectionGridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg" | "xl";
}

const gapStyles = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8 md:gap-10",
  xl: "gap-10 md:gap-14",
};

const colStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export const SectionGrid = forwardRef<HTMLDivElement, SectionGridProps>(
  ({ cols = 3, gap = "md", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid", colStyles[cols], gapStyles[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SectionGrid.displayName = "SectionGrid";
