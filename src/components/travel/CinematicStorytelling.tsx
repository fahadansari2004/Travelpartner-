"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  Sparkles, 
  Hotel, 
  Plane, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  Globe,
  Volume2,
  VolumeX,
  MapPin,
  Heart,
  Users,
  Briefcase,
  Ship,
  Shield,
  Car,
  FileCheck,
  Star,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import { TestimonialsSection } from "@/components/travel/TestimonialsSection";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useStoreData, INITIAL_SERVICES, INITIAL_PACKAGES } from "@/lib/storage";

// Icon Map helper
const ICON_MAP: Record<string, any> = {
  Plane,
  Hotel,
  Compass,
  FileCheck,
  Heart,
  Users,
  Briefcase,
  Globe,
  Ship,
  Sparkles,
  Shield,
  Car,
};

interface Chapter {
  id: string;
  number: string;
  title: string;
  videoSrc: string;
}

const CHAPTERS: Chapter[] = [
  { id: "hero", number: "01", title: "Hero", videoSrc: "/videos/hero.mp4" },
  { id: "about", number: "02", title: "About Us", videoSrc: "/videos/airport.mp4" },
  { id: "services", number: "03", title: "Services", videoSrc: "/videos/takeoff.mp4" },
  { id: "destinations", number: "04", title: "Destinations", videoSrc: "/videos/switzerland.mp4" },
  { id: "why-us", number: "05", title: "Why Choose Us", videoSrc: "/videos/dubai.mp4" },
  { id: "packages-section", number: "06", title: "Tour Packages", videoSrc: "/videos/paris.mp4" },
  { id: "testimonials-section", number: "07", title: "Testimonials", videoSrc: "/videos/maldives.mp4" },
  { id: "faq-section", number: "08", title: "FAQ & Contact", videoSrc: "/videos/ending.mp4" },
];

/**
 * Strict Scroll-Driven Video Frame Scrubber with Mobile Viewport Safety
 */
function FrameScrubVideo({
  videoSrc,
  containerRef,
  isHero
}: {
  videoSrc: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isHero?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    video.pause();

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: 0.3,
        onUpdate: (self) => {
          if (video.duration && !isNaN(video.duration)) {
            video.pause();
            const targetTime = self.progress * video.duration;
            if (Math.abs(video.currentTime - targetTime) > 0.03) {
              video.currentTime = targetTime;
            }
          }
        },
      });

      gsap.fromTo(
        video,
        { scale: 1.0 },
        {
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=120%",
            scrub: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [containerRef, videoSrc]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none">
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/70" />
    </div>
  );
}

export function CinematicStorytelling() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [activeServiceModal, setActiveServiceModal] = useState<any | null>(null);

  // Carousel Refs
  const servicesCarouselRef = useRef<HTMLDivElement>(null);
  const whyUsCarouselRef = useRef<HTMLDivElement>(null);
  const packagesCarouselRef = useRef<HTMLDivElement>(null);

  // Dynamic store data
  const [services] = useStoreData("services", INITIAL_SERVICES);
  const [packages] = useStoreData("packages", INITIAL_PACKAGES);

  // Section Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);
  const pkgRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const activeServices = services.filter((s) => s.active).sort((a, b) => a.displayOrder - b.displayOrder);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const index = CHAPTERS.findIndex((ch) => ch.id === id);
      if (index !== -1) setActiveChapterIndex(index);
    }
  };

  // Track active section automatically on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -30% 0px",
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = CHAPTERS.findIndex((ch) => ch.id === entry.target.id);
          if (index !== -1) {
            setActiveChapterIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    CHAPTERS.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-scroll mobile carousels
  useEffect(() => {
    const autoScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (ref.current && window.innerWidth < 768) {
        const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;
        if (ref.current.scrollLeft >= maxScroll - 15) {
          ref.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          ref.current.scrollBy({ left: ref.current.clientWidth * 0.85, behavior: "smooth" });
        }
      }
    };

    const interval = setInterval(() => {
      autoScroll(servicesCarouselRef);
      autoScroll(whyUsCarouselRef);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full text-white bg-slate-950 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      
      {/* ── DESKTOP CHAPTER SIDEBAR PROGRESS INDICATOR ───────────────────────── */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 pointer-events-auto">
        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === activeChapterIndex;
          return (
            <button
              key={ch.id}
              onClick={() => scrollToSection(ch.id)}
              className="group flex items-center gap-3 cursor-pointer py-1"
            >
              <span 
                className={`text-xs font-semibold tracking-wider transition-all duration-300 ${
                  isActive ? "text-amber-400 opacity-100 translate-x-0" : "text-slate-400 opacity-0 group-hover:opacity-100 translate-x-2"
                }`}
              >
                {ch.number}. {ch.title}
              </span>
              <div 
                className={`transition-all duration-300 rounded-full ${
                  isActive 
                    ? "w-3 h-3 bg-amber-400 shadow-lg shadow-amber-400/50 scale-125" 
                    : "w-2 h-2 bg-white/30 group-hover:bg-white/70"
                }`}
              />
            </button>
          );
        })}
      </aside>

      {/* ── AMBIENT AUDIO TOGGLE ────────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-40">
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className="glass px-3.5 py-2.5 rounded-full border border-white/20 flex items-center gap-2.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-all shadow-xl backdrop-blur-md min-h-[44px]"
        >
          {isAudioMuted ? <VolumeX size={16} className="text-slate-400 shrink-0" /> : <Volume2 size={16} className="text-amber-400 animate-pulse shrink-0" />}
          <span className="hidden sm:inline">{isAudioMuted ? "Soundscape Off" : "Ambient Soundscape Active"}</span>
        </button>
      </div>


      {/* ── 1. HERO SECTION (Fluid Responsive Typography) ───────────────────── */}
      <section 
        id="hero" 
        ref={heroRef}
        className="relative w-full h-screen flex flex-col items-center"
      >
        <FrameScrubVideo videoSrc="/videos/hero.mp4" containerRef={heroRef} isHero={true} />

        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center max-w-5xl space-y-4 sm:space-y-8 pt-20 sm:pt-24 pb-10 w-full px-2 sm:px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-5 sm:py-2 rounded-full glass border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-amber-500/10 max-w-full">
            <Sparkles size={14} className="animate-pulse text-amber-400 shrink-0" />
            <span className="truncate">ULTRA-LUXURY BESPOKE EXPEDITIONS</span>
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-[family-name:var(--font-playfair)] leading-[1.12] sm:leading-[1.08] max-w-xs sm:max-w-4xl mx-auto">
            Every Journey Begins With A <span className="gradient-text">Dream</span>
          </h1>

          <p className="text-xs sm:text-lg md:text-2xl text-slate-200 font-light max-w-xs sm:max-w-2xl mx-auto leading-relaxed">
            Explore the world&apos;s most extraordinary destinations with travelPartner.
          </p>

          {/* Clean Responsive CTA Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-5 w-full max-w-xs sm:max-w-none mx-auto">
            <Link href="/packages" className="w-full sm:w-auto">
              <Button 
                variant="amber" 
                size="lg" 
                rightIcon={<ArrowRight size={16} />}
                className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] text-xs sm:text-sm font-bold shadow-xl shadow-amber-500/25 justify-center"
              >
                Book Your Journey
              </Button>
            </Link>
            <Link href="/flights" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] text-xs sm:text-sm font-bold justify-center border-white/30 text-white hover:bg-white/10"
              >
                Explore Special Flights
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 flex flex-col items-center gap-2 text-slate-400 pb-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-medium">Scroll to scrub journey</span>
          <div className="w-7 h-10 sm:w-8 sm:h-12 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5 backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-amber-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>


      {/* ── 2. ABOUT US SECTION ───────────────────────────────────────────── */}
      <section 
        id="about" 
        ref={aboutRef}
        className="relative w-full h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 overflow-hidden"
      >
        <FrameScrubVideo videoSrc="/videos/airport.mp4" containerRef={aboutRef} />

        <div className="relative z-10 glass-card max-w-4xl w-full p-6 sm:p-12 lg:p-14 rounded-3xl border border-white/15 bg-black/50 backdrop-blur-2xl text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold uppercase tracking-widest">
            <Compass size={14} /> About travelPartner
          </div>

          <h2 className="text-[clamp(1.75rem,4vw,3.75rem)] font-bold tracking-tight font-[family-name:var(--font-playfair)]">
            Redefining <span className="gradient-text">Luxury Travel</span>
          </h2>

          <p className="text-sm sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            With over two decades of bespoke expedition management, travelPartner pairs discerning global travelers with unmatched first-class aviation, 7-star resorts, and private concierge services worldwide.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center border-t border-white/10">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-[family-name:var(--font-playfair)]">150+</span>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Destinations</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-[family-name:var(--font-playfair)]">50k+</span>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">VIP Clients</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-[family-name:var(--font-playfair)]">99.8%</span>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Satisfaction</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-[family-name:var(--font-playfair)]">24/7</span>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Concierge</p>
            </div>
          </div>
        </div>
      </section>


      {/* ── 3. SERVICES CAROUSEL SECTION ───────────────────────────────────── */}
      <section 
        id="services" 
        ref={servicesRef}
        className="relative w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-16 sm:py-24 overflow-hidden"
      >
        <FrameScrubVideo videoSrc="/videos/takeoff.mp4" containerRef={servicesRef} />

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8">
          {/* Header & Carousel Arrows */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Bespoke Concierge</span>
              <h2 className="text-[clamp(1.75rem,4vw,3.75rem)] font-bold font-[family-name:var(--font-playfair)]">
                Our Signature <span className="gradient-text">Services</span>
              </h2>
              <p className="text-xs sm:text-base text-slate-300 font-light">
                Swipe or scroll horizontally to discover our 12 luxury travel management solutions.
              </p>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollCarousel(servicesCarouselRef, "left")}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all active:scale-95 shadow-lg"
                aria-label="Previous service"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => scrollCarousel(servicesCarouselRef, "right")}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all active:scale-95 shadow-lg"
                aria-label="Next service"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Interactive Touch Carousel */}
          <div 
            ref={servicesCarouselRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {activeServices.map((serv) => {
              const IconComponent = ICON_MAP[serv.iconName] || Globe;
              return (
                <div
                  key={serv.id}
                  onClick={() => setActiveServiceModal(serv)}
                  className="snap-start shrink-0 w-[280px] sm:w-[320px] lg:w-[340px] glass-card p-6 rounded-3xl border border-white/15 bg-slate-900/70 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer group shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      <IconComponent size={22} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center justify-between">
                      {serv.name}
                      <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                    </h3>
                    <p className="text-xs text-slate-300 font-light leading-relaxed mb-4">
                      {serv.shortDesc}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform border-t border-white/10 pt-3">
                    {serv.ctaText} →
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ── 4. FEATURED DESTINATIONS ────────────────────────────────────── */}
      <section 
        id="destinations" 
        ref={destRef}
        className="relative w-full h-screen flex items-center justify-start px-4 sm:px-8 lg:px-16 overflow-hidden"
      >
        <FrameScrubVideo videoSrc="/videos/switzerland.mp4" containerRef={destRef} />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <MapPin size={14} /> Swiss Alps & Valleys
          </div>

          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight text-white font-[family-name:var(--font-playfair)]">
            Majestic <br /><span className="gradient-text">Switzerland</span>
          </h2>

          <p className="text-sm sm:text-lg text-slate-300 font-light leading-relaxed">
            Glacier express trains, snow-capped alpine peaks, and private chalets nestling in pristine wilderness.
          </p>

          <Link href="/packages" className="inline-block w-full sm:w-auto">
            <Button variant="amber" size="lg" className="w-full sm:w-auto min-h-[48px] shadow-xl shadow-amber-500/20">
              Explore Alpine Packages
            </Button>
          </Link>
        </div>
      </section>


      {/* ── 5. WHY CHOOSE US CAROUSEL SECTION ───────────────────────────── */}
      <section 
        id="why-us" 
        ref={whyUsRef}
        className="relative w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-16 overflow-hidden"
      >
        <FrameScrubVideo videoSrc="/videos/dubai.mp4" containerRef={whyUsRef} />

        <div className="relative z-10 max-w-7xl mx-auto space-y-8 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Excellence Guarantee</span>
              <h2 className="text-[clamp(1.75rem,4vw,3.75rem)] font-bold font-[family-name:var(--font-playfair)]">
                Why Choose <span className="gradient-text">travelPartner</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollCarousel(whyUsCarouselRef, "left")}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all active:scale-95 shadow-lg"
                aria-label="Previous reason"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => scrollCarousel(whyUsCarouselRef, "right")}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all active:scale-95 shadow-lg"
                aria-label="Next reason"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div 
            ref={whyUsCarouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="snap-start shrink-0 w-[300px] sm:w-[360px] glass-card p-8 rounded-3xl border border-white/15 bg-black/60 backdrop-blur-2xl space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">VIP Protection & Privacy</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Complete discretion for high-profile travelers, diplomatic delegations, and private families with armored transfers.
              </p>
            </div>

            <div className="snap-start shrink-0 w-[300px] sm:w-[360px] glass-card p-8 rounded-3xl border border-white/15 bg-black/60 backdrop-blur-2xl space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Curated 5-Star Access</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Exclusive access to sold-out hotel inventory, private museum tours, and superyacht charters around the world.
              </p>
            </div>

            <div className="snap-start shrink-0 w-[300px] sm:w-[360px] glass-card p-8 rounded-3xl border border-white/15 bg-black/60 backdrop-blur-2xl space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Compass size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">24/7 Dedicated Concierge</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Personal travel manager assigned to your trip from touchdown to departure for instant itinerary updates.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ── 6. FEATURED TOUR PACKAGES CAROUSEL SECTION ────────────────────── */}
      <section 
        id="packages-section" 
        ref={pkgRef}
        className="relative w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-16 overflow-hidden"
      >
        <FrameScrubVideo videoSrc="/videos/paris.mp4" containerRef={pkgRef} />

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Hand-Crafted Expeditions</span>
              <h2 className="text-[clamp(1.75rem,4vw,3.75rem)] font-bold font-[family-name:var(--font-playfair)]">
                Featured <span className="gradient-text">Packages</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollCarousel(packagesCarouselRef, "left")}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all active:scale-95 shadow-lg"
                aria-label="Previous package"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => scrollCarousel(packagesCarouselRef, "right")}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all active:scale-95 shadow-lg"
                aria-label="Next package"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div 
            ref={packagesCarouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {packages.filter((p) => p.active).map((pkg) => (
              <div 
                key={pkg.id} 
                className="snap-start shrink-0 w-[290px] sm:w-[340px] glass-card rounded-3xl overflow-hidden border border-white/15 bg-slate-900/80 group shadow-2xl flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-800">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    {pkg.destination}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span>{pkg.duration}</span>
                    <span>★ {pkg.rating}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white line-clamp-1">{pkg.name}</h3>

                  <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                    <div>
                      <span className="text-2xl font-bold text-amber-400">${pkg.discountPrice || pkg.price}</span>
                      {pkg.discountPrice && <span className="text-xs text-slate-500 line-through ml-2">${pkg.price}</span>}
                    </div>
                    <Link href="/packages">
                      <Button variant="amber" size="sm">Explore</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── 7. TESTIMONIALS SECTION ──────────────────────────────────────── */}
      <section 
        id="testimonials-section" 
        ref={testimonialsRef}
        className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 py-16 overflow-hidden"
      >
        <FrameScrubVideo videoSrc="/videos/maldives.mp4" containerRef={testimonialsRef} />

        <div className="relative z-10 w-full max-w-5xl">
          <TestimonialsSection />
        </div>
      </section>


      {/* ── 8. FAQ & CONTACT SECTION ────────────────────────────────────── */}
      <section 
        id="faq-section" 
        ref={faqRef}
        className="relative w-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-8 lg:px-16 pt-20 pb-12 overflow-hidden"
      >
        <FrameScrubVideo videoSrc="/videos/ending.mp4" containerRef={faqRef} />

        <div className="relative z-10 text-center max-w-4xl space-y-8 my-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-widest">
            <Sparkles size={16} /> Ready to Begin?
          </div>

          <h2 className="text-[clamp(2.25rem,6vw,5rem)] font-bold tracking-tight font-[family-name:var(--font-playfair)]">
            Your Journey <span className="gradient-text">Starts Today</span>
          </h2>

          <p className="text-base sm:text-2xl text-amber-100 font-light max-w-2xl mx-auto">
            Flights • Hotels • Holiday Packages • Visas • Special Fares
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 max-w-md mx-auto w-full">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button 
                variant="amber" 
                size="lg" 
                rightIcon={<ArrowRight size={18} />}
                className="w-full sm:w-auto min-h-[48px] shadow-xl shadow-amber-500/25 justify-center"
              >
                Contact Concierge
              </Button>
            </Link>

            <Link href="/packages" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto min-h-[48px] border-white/30 text-white hover:bg-white/10 justify-center"
              >
                Browse All Packages
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 w-full max-w-7xl pt-16">
          <Footer />
        </div>
      </section>

      {/* Service Modal */}
      <AnimatePresence>
        {activeServiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveServiceModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-white/20 bg-slate-900/95 text-white space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-playfair)]">
                  {activeServiceModal.name}
                </h3>
                <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-white p-2">✕</button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>{activeServiceModal.longDesc}</p>
              </div>

              <Link href="/contact" onClick={() => setActiveServiceModal(null)}>
                <Button variant="amber" size="lg" fullWidth className="min-h-[48px]">
                  {activeServiceModal.ctaText}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
