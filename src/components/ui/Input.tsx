import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      wrapperClassName,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors duration-200 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-11 bg-slate-900 border border-slate-700/60 rounded-xl",
              "text-slate-100 placeholder:text-slate-500 text-sm",
              "transition-all duration-200",
              "hover:border-slate-600",
              "focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 focus:bg-slate-800/60",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              !leftIcon && "pl-4",
              !rightIcon && "pr-4",
              error && "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors duration-200">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
