"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { Logo } from "@/components/ui/Logo";

interface PreloaderProps {
  onComplete?: () => void;
}

const LOADING_STEPS = [
  "Mapping global destinations...",
  "Calibrating smooth experience...",
  "Curating luxury retreats...",
  "Preparing your journey...",
];

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState(LOADING_STEPS[0]);
  const [isFinished, setIsFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const stepTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // ── Prevent scrolling during intro ─────────────────────────────────────
    document.body.style.overflow = "hidden";

    // ── Counter & Step Interval ────────────────────────────────────────────
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setProgress(currentProgress);

      const stepIndex = Math.min(
        Math.floor((currentProgress / 100) * LOADING_STEPS.length),
        LOADING_STEPS.length - 1
      );
      setStepText(LOADING_STEPS[stepIndex]);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // ── Animate Exit Transition with GSAP ─────────────────────────────────
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsFinished(true);
            document.body.style.overflow = "";
            onComplete?.();
          },
        });

        tl.to(
          [
            logoRef.current,
            progressTextRef.current,
            stepTextRef.current,
            progressBarRef.current,
          ],
          {
            opacity: 0,
            y: -20,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.in",
          }
        ).to(containerRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "expo.inOut",
        });
      });

      return () => ctx.revert();
    }
  }, [progress, onComplete]);

  if (isFinished) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center px-4 overflow-hidden select-none"
    >
      {/* Background glow accents */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        style={{ background: "rgba(245, 158, 11, 0.12)" }}
      />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Official Brand Logo */}
        <div ref={logoRef} className="flex flex-col items-center gap-4 mb-8">
          <Logo size="lg" />
        </div>

        {/* Progress Numbers */}
        <div className="flex items-baseline gap-1 mb-3">
          <span
            ref={progressTextRef}
            className="text-5xl font-bold text-white font-[family-name:var(--font-playfair)] tracking-tight"
          >
            {progress}
          </span>
          <span className="text-xl font-medium text-amber-400">%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden mb-4 p-0.5">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-150 ease-out shadow-lg shadow-amber-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text Step */}
        <p
          ref={stepTextRef}
          className="text-xs text-slate-500 font-medium tracking-wide uppercase h-4"
        >
          {stepText}
        </p>
      </div>

      {/* Decorative Bottom Tag */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-400 tracking-widest uppercase font-semibold">
        PLAN A BETTER THRILL... • travelPartner
      </div>
    </div>
  );
}
