"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null!);
  const cursorRingRef = useRef<HTMLDivElement>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const dotX = gsap.quickTo(cursorDotRef.current, "x", { duration: 0.1, ease: "power3" });
    const dotY = gsap.quickTo(cursorDotRef.current, "y", { duration: 0.1, ease: "power3" });
    const ringX = gsap.quickTo(cursorRingRef.current, "x", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(cursorRingRef.current, "y", { duration: 0.35, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400 pointer-events-none z-[9999] transition-transform duration-150 ${
          isHovered ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      />
      {/* Outer Ring */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none z-[9998] transition-all duration-300 ${
          isHovered
            ? "w-14 h-14 border-amber-400/80 bg-amber-500/10 backdrop-blur-[1px] scale-100"
            : "w-8 h-8 border-white/40 bg-transparent scale-100"
        }`}
      />
    </>
  );
}
