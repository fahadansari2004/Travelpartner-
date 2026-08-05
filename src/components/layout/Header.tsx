"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "glass py-1.5 sm:py-2 border-b border-white/10 bg-slate-950/90 backdrop-blur-md shadow-2xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
            : "bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-transparent py-1.5 sm:py-2.5 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 sm:gap-8 h-14 sm:h-16">
            
            {/* Seamless Transparent Floating Logo (No background box/card) */}
            <Link href="/" className="group shrink-0 flex items-center pl-1 sm:pl-3 py-1">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation Links (Centered & Opaque Glass) */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-white/15 rounded-full px-5 py-1.5 backdrop-blur-xl shadow-xl" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4.5 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-200 min-h-[36px] flex items-center justify-center",
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA (Right Aligned) */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <Link href="/contact">
                <Button
                  variant="amber"
                  size="md"
                  leftIcon={<MapPin size={16} />}
                  className="min-h-[42px] px-6 shadow-xl shadow-amber-500/25"
                >
                  Book a Trip
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle (48px Touch Target) */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-slate-200 hover:text-amber-400 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-all shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* ── FULLSCREEN GLASSMORPHISM MOBILE NAVIGATION OVERLAY ──────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10"
          >
            {/* Top Bar: Floating Brand Logo & Close Icon */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <Logo size="md" />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Fullscreen Links */}
            <nav className="flex flex-col gap-4 my-auto py-6" aria-label="Mobile Navigation Drawer">
              {NAV_LINKS.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-3 px-4 rounded-2xl text-2xl font-bold font-[family-name:var(--font-playfair)] transition-all min-h-[56px]",
                        isActive
                          ? "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                          : "text-slate-200 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={20} className={isActive ? "text-amber-400" : "text-slate-500"} />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile Footer CTAs */}
            <div className="border-t border-white/10 pt-6 space-y-3">
              <Link href="/contact" onClick={() => setIsMobileOpen(false)}>
                <Button variant="amber" size="lg" fullWidth leftIcon={<MapPin size={18} />} className="min-h-[52px]">
                  Book Your Expedition
                </Button>
              </Link>
              <div className="text-center text-xs text-slate-400 font-medium">
                PLAN A BETTER THRILL... • travelPartner
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
