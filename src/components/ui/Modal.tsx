"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const sizeClasses = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-[95vw]",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  className,
}: ModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in-up"
        style={{ animation: "none", opacity: 1 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full glass-card rounded-2xl shadow-2xl",
          "animate-fade-in-up",
          sizeClasses[size],
          className
        )}
        style={{
          animation: "fade-in-up 0.25s ease-out forwards",
        }}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 p-6 pb-4">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-slate-50 font-[family-name:var(--font-playfair)]"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-slate-400 mt-1">{description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={onClose}
              className="shrink-0 rounded-lg"
              aria-label="Close modal"
            >
              <X size={18} />
            </Button>
          </div>
        )}

        {/* Close button only (no title) */}
        {!title && !description && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        )}

        {/* Content */}
        <div className="px-6 pb-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-800/60 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
