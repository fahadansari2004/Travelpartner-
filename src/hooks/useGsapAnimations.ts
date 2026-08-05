"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnimationConfig } from "@/lib/types";

export const EASINGS = {
  EXPO_OUT: "expo.out",
  POWER4_OUT: "power4.out",
  CUBIC_OUT: "cubic.out",
  BACK_OUT: "back.out(1.4)",
};

/**
 * useGsapFadeIn
 * Fades an element in from below when it enters the viewport.
 */
export function useGsapFadeIn<T extends HTMLElement>(
  config: AnimationConfig = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const {
      duration = 0.8,
      delay = 0,
      ease = "power2.out",
      start = "top 85%",
    } = config;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [config]);

  return ref;
}

/**
 * useGsapReveal
 * Staggers child elements into view — ideal for cards and lists.
 */
export function useGsapReveal<T extends HTMLElement>(
  config: AnimationConfig = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const {
      duration = 0.7,
      delay = 0,
      ease = "power2.out",
      stagger = 0.12,
      start = "top 80%",
    } = config;

    const ctx = gsap.context(() => {
      const children = el.children;
      gsap.fromTo(
        children,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease,
          stagger,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [config]);

  return ref;
}

/**
 * useGsapTimeline
 * Returns a GSAP timeline bound to the component's lifecycle.
 * Automatically killed on unmount.
 */
export function useGsapTimeline(
  config: { paused?: boolean; repeat?: number; yoyo?: boolean } = {}
) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    tlRef.current = gsap.timeline({
      paused: config.paused ?? true,
      repeat: config.repeat ?? 0,
      yoyo: config.yoyo ?? false,
    });

    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, [config.paused, config.repeat, config.yoyo]);

  return tlRef;
}

/**
 * useScrollProgress
 * Returns a ref element and a mutable ref to the 0–1 scroll progress value.
 */
export function useScrollProgress<T extends HTMLElement>(
  onProgress?: (progress: number) => void
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        onProgress?.(self.progress);
      },
    });

    return () => trigger.kill();
  }, [onProgress]);

  return ref;
}

/**
 * useParallax
 * Applies a Y-axis parallax offset to an element as the user scrolls.
 * @param speed  Multiplier: positive = slower than scroll, negative = opposite direction
 */
export function useParallax<T extends HTMLElement>(
  speed: number = 0.3
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * -100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/**
 * useGsapSlideIn
 * Slides an element in from a given direction.
 */
export function useGsapSlideIn<T extends HTMLElement>(
  direction: "left" | "right" | "up" | "down" = "up",
  config: AnimationConfig = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const { duration = 0.9, delay = 0, ease = "expo.out", start = "top 85%" } =
      config;

    const fromVars: gsap.TweenVars = { opacity: 0 };
    if (direction === "left") fromVars.x = -60;
    if (direction === "right") fromVars.x = 60;
    if (direction === "up") fromVars.y = 60;
    if (direction === "down") fromVars.y = -60;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, fromVars, {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [direction, config]);

  return ref;
}

/**
 * useGsapCounter
 * Animates a numeric value from 0 to target on scroll entry.
 */
export function useGsapCounter(
  target: number,
  config: AnimationConfig & { prefix?: string; suffix?: string } = {}
): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const { duration = 2, ease = "power1.out", prefix = "", suffix = "" } =
      config;

    const obj = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        value: target,
        duration,
        ease,
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.value).toLocaleString()}${suffix}`;
        },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [target, config]);

  return ref;
}
