"use client";

import { useEffect, useRef, memo } from "react";
import Link from "next/link";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";

export const HeroPinnedSection = memo(function HeroPinnedSection() {
  const textContentRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Fade out the hero text as soon as the user starts scrolling down the 600vh track
      gsap.to(textContentRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.95,
        scrollTrigger: {
          trigger: "#hero-container",
          start: "top top",
          end: "15% top", // Fade out over the first 15% of the scroll
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div id="hero-container" className="relative min-h-[600vh] w-full pointer-events-none">
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-[1px] noise-overlay pt-20 overflow-hidden pointer-events-auto">
        
        {/* Ambient background glow blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float"
          style={{ background: "rgba(245, 158, 11, 0.08)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-float"
          style={{ background: "rgba(59, 130, 246, 0.08)", animationDelay: "2s" }}
        />

        <div ref={textContentRef} className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm text-slate-300 font-medium">
              Discover Your Next Horizon
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight font-[family-name:var(--font-playfair)]">
            The World is
            <br />
            <span className="gradient-text italic">Waiting for You</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Curated luxury expeditions across 7 continents. Handcrafted itineraries, 24/7 concierge support, and unforgettable memories.
          </p>

          {/* Floating Search Bar */}
          <div className="mt-10 max-w-2xl w-full transition-all duration-300">
            <div className="glass-card rounded-2xl p-2 flex flex-col sm:flex-row gap-2 border border-white/10 shadow-2xl">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="hero-pinned-search"
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full h-12 bg-transparent pl-11 pr-4 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none"
                  aria-label="Search destinations"
                />
              </div>
              <Button
                variant="amber"
                size="lg"
                leftIcon={<MapPin size={16} />}
                className="sm:shrink-0 pointer-events-auto"
              >
                <Link href="/destinations">Explore Now</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-float">
          <span className="text-[10px] tracking-widest uppercase">Scroll To Explore</span>
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
});
