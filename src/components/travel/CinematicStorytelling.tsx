"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  Sparkles, 
  Hotel, 
  Plane, 
  ArrowRight,
  ArrowLeft,
  Globe,
  Volume2,
  VolumeX,
  Heart,
  Users,
  Briefcase,
  Ship,
  Shield,
  Car,
  FileCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import { TestimonialsSection } from "@/components/travel/TestimonialsSection";
import { useStoreData, INITIAL_SERVICES, INITIAL_PACKAGES } from "@/lib/storage";

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

interface SectionItem {
  id: string;
  title: string;
  imageSrc: string;
}

const SECTIONS: SectionItem[] = [
  { 
    id: "hero", 
    title: "Home", 
    imageSrc: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
  },
  { 
    id: "about", 
    title: "About Us", 
    imageSrc: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85"
  },
  { 
    id: "services", 
    title: "Services", 
    imageSrc: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85"
  },
  { 
    id: "why-us", 
    title: "Why Choose Us", 
    imageSrc: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85"
  },
  { 
    id: "packages-section", 
    title: "Tour Packages", 
    imageSrc: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=85"
  },
  { 
    id: "testimonials-section", 
    title: "Guest Reviews", 
    imageSrc: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2000&q=85"
  },
  { 
    id: "faq-section", 
    title: "Contact", 
    imageSrc: "https://images.unsplash.com/photo-1476514525535-ce74f45814d4?auto=format&fit=crop&w=2000&q=85"
  },
];

/**
 * Scroll-Driven Smooth Parallax Background Animation Component
 */
function AnimatedParallaxBackground({ imageSrc }: { imageSrc: string }) {
  const [imgUrl, setImgUrl] = useState(imageSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgUrl(imageSrc);
    setHasError(false);
  }, [imageSrc]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950 pointer-events-none z-0">
      {!hasError ? (
        <motion.img
          initial={{ scale: 1.15, opacity: 0.45 }}
          whileInView={{ scale: 1.0, opacity: 0.65 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={imgUrl}
          alt=""
          onError={() => {
            if (!imgUrl.includes("photo-1507525428034")) {
              setImgUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85");
            } else {
              setHasError(true);
            }
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/80" />
    </div>
  );
}

export function CinematicStorytelling() {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [activeServiceModal, setActiveServiceModal] = useState<any>(null);

  const [services] = useStoreData("services", INITIAL_SERVICES);
  const [packages] = useStoreData("packages", INITIAL_PACKAGES);

  const servicesCarouselRef = useRef<HTMLDivElement>(null);

  const activeServices = (services || []).filter((s) => s.active).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topPos = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
      const index = SECTIONS.findIndex((s) => s.id === id);
      if (index !== -1) setActiveSectionIndex(index);
    }
  };

  // Track active section automatically on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = SECTIONS.findIndex((s) => s.id === entry.target.id);
          if (index !== -1) {
            setActiveSectionIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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
      
      {/* ── DESKTOP SIDEBAR PROGRESS INDICATOR ───────────────────────── */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 pointer-events-auto">
        {SECTIONS.map((sec, idx) => {
          const isActive = idx === activeSectionIndex;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="group flex items-center gap-3 cursor-pointer py-1"
            >
              <span 
                className={`text-xs font-semibold tracking-wider transition-all duration-300 ${
                  isActive ? "text-amber-400 opacity-100 translate-x-0" : "text-slate-400 opacity-0 group-hover:opacity-100 translate-x-2"
                }`}
              >
                {sec.title}
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

      {/* ── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section 
        id="hero" 
        className="relative w-full min-h-screen flex flex-col items-center justify-between py-16 sm:py-24"
      >
        <AnimatedParallaxBackground imageSrc={SECTIONS[0].imageSrc} />

        <div className="relative z-10 my-auto flex flex-col justify-center items-center text-center max-w-5xl space-y-6 sm:space-y-8 w-full px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full glass border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-amber-500/10"
          >
            <Sparkles size={14} className="animate-pulse text-amber-400 shrink-0" />
            <span>ULTRA-LUXURY BESPOKE EXPEDITIONS</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-[family-name:var(--font-playfair)] leading-[1.12] sm:leading-[1.08] max-w-xs sm:max-w-4xl mx-auto"
          >
            Every Journey Begins With A <span className="gradient-text">Dream</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-lg md:text-2xl text-slate-200 font-light max-w-xs sm:max-w-2xl mx-auto leading-relaxed"
          >
            Explore the world&apos;s most extraordinary destinations with travelPartner.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full max-w-xs sm:max-w-none mx-auto"
          >
            <Link href="/packages" className="w-full sm:w-auto">
              <Button 
                variant="amber" 
                size="lg" 
                rightIcon={<ArrowRight size={16} />}
                className="w-full sm:w-auto min-h-[46px] sm:min-h-[50px] text-xs sm:text-sm font-bold shadow-xl shadow-amber-500/25 justify-center"
              >
                Book Your Journey
              </Button>
            </Link>
            <Link href="/flights" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto min-h-[46px] sm:min-h-[50px] text-xs sm:text-sm font-bold justify-center border-white/30 text-white hover:bg-white/10"
              >
                Explore Special Flights
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <button 
          onClick={() => scrollToSection("about")}
          className="relative z-10 flex flex-col items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-medium">Scroll to Explore</span>
          <div className="w-7 h-10 sm:w-8 sm:h-12 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5 backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-amber-400 rounded-full animate-bounce" />
          </div>
        </button>
      </section>

      {/* ── 2. ABOUT US SECTION ───────────────────────────────────────────── */}
      <section 
        id="about" 
        className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 py-20 overflow-hidden"
      >
        <AnimatedParallaxBackground imageSrc={SECTIONS[1].imageSrc} />

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 glass-card max-w-4xl w-full p-6 sm:p-12 lg:p-14 rounded-3xl border border-white/15 bg-black/50 backdrop-blur-2xl text-center space-y-6 shadow-2xl"
        >
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
        </motion.div>
      </section>

      {/* ── 3. SERVICES CAROUSEL SECTION ───────────────────────────────────── */}
      <section 
        id="services" 
        className="relative w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-16 sm:py-24 overflow-hidden"
      >
        <AnimatedParallaxBackground imageSrc={SECTIONS[2].imageSrc} />

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-2"
            >
              <h2 className="text-3xl sm:text-5xl font-bold font-[family-name:var(--font-playfair)]">
                Exclusive <span className="gradient-text">Concierge Services</span>
              </h2>
            </motion.div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollCarousel(servicesCarouselRef, "left")} 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all border border-white/10"
              >
                <ArrowLeft size={18} />
              </button>
              <button 
                onClick={() => scrollCarousel(servicesCarouselRef, "right")} 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all border border-white/10"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div 
            ref={servicesCarouselRef} 
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4"
          >
            {activeServices.map((serv, i) => {
              const Icon = ICON_MAP[serv.iconName || "Compass"] || Compass;
              return (
                <motion.div
                  key={serv.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => setActiveServiceModal(serv)}
                  className="snap-start shrink-0 w-[280px] sm:w-[360px] glass-card p-6 sm:p-8 rounded-3xl border border-white/15 bg-slate-900/60 hover:bg-slate-900/80 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">{serv.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{serv.shortDesc}</p>
                  </div>
                  <div className="pt-6 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>{serv.ctaText || "Learn More"}</span>
                    <ChevronRight size={16} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. WHY US SECTION ─────────────────────────────────────────────── */}
      <section 
        id="why-us" 
        className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 py-20 overflow-hidden"
      >
        <AnimatedParallaxBackground imageSrc={SECTIONS[3].imageSrc} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-5xl w-full glass-card p-8 sm:p-12 rounded-3xl border border-white/15 bg-black/60 backdrop-blur-2xl space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-playfair)]">
              Why Discerning Travelers Choose <span className="gradient-text">travelPartner</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "24/7 Dedicated Butler", desc: "A personal concierge assigned to your trip from takeoff to landing." },
              { title: "Direct Tarmac Transfers", desc: "Private VIP jet handling and luxury sports car escorts." },
              { title: "Unmatched Confidentiality", desc: "Discreet expedition management for high-profile explorers." },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)]">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 5. PACKAGES SECTION ────────────────────────────────────────────── */}
      <section 
        id="packages-section" 
        className="relative w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-16 sm:py-24 overflow-hidden"
      >
        <AnimatedParallaxBackground imageSrc={SECTIONS[4].imageSrc} />

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-bold font-[family-name:var(--font-playfair)]">
                Featured <span className="gradient-text">Tour Packages</span>
              </h2>
            </div>
            <Link href="/packages">
              <Button variant="amber" size="md" rightIcon={<ArrowRight size={16} />}>
                View All Packages
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(packages || []).slice(0, 3).map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-3xl overflow-hidden border border-white/15 bg-slate-900/70 space-y-4 flex flex-col justify-between p-5"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                      ${pkg.discountPrice || pkg.price}
                    </span>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold uppercase">{pkg.destination}</span>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-white">{pkg.name}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">{pkg.shortDesc || pkg.description}</p>
                </div>
                <Link href="/packages" className="pt-2">
                  <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
                    Reserve Package
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS SECTION ────────────────────────────────────────── */}
      <section 
        id="testimonials-section" 
        className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 py-16 overflow-hidden"
      >
        <AnimatedParallaxBackground imageSrc={SECTIONS[5].imageSrc} />

        <div className="relative z-10 w-full max-w-5xl">
          <TestimonialsSection />
        </div>
      </section>

      {/* ── 7. FAQ & CONTACT SECTION ────────────────────────────────────── */}
      <section 
        id="faq-section" 
        className="relative w-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-8 lg:px-16 pt-20 pb-12 overflow-hidden"
      >
        <AnimatedParallaxBackground imageSrc={SECTIONS[6].imageSrc} />

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
