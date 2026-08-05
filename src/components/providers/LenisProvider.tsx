"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LENIS_CONFIG } from "@/lib/constants";

// ─── Context ──────────────────────────────────────────────────────────────────
interface LenisContextValue {
  getLenis: () => Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({
  getLenis: () => null,
});

/**
 * useLenis
 * Access the Lenis getter anywhere inside <LenisProvider>.
 */
export function useLenis(): LenisContextValue {
  return useContext(LenisContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disable JS touch interception on mobile devices to allow native 120Hz smooth inertia scrolling
    const isTouchDevice = typeof window !== "undefined" && (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    );

    if (isTouchDevice) {
      return;
    }

    const lenis = new Lenis({
      ...LENIS_CONFIG,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // ── Sync Lenis scroll position with GSAP ScrollTrigger ──────────────────
    lenis.on("scroll", ScrollTrigger.update);

    // ── Drive Lenis via GSAP's RAF ticker for perfect synchronization ────────
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis expects ms
    };

    gsap.ticker.add(tickerCallback);

    // Disable GSAP's own lag smoothing so it doesn't conflict with Lenis
    gsap.ticker.lagSmoothing(0);

    // ── ScrollTrigger proxy for Lenis-driven scroll position ─────────────────
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.removeEventListener("refresh", () => lenis.resize());
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={{ getLenis: () => lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}
