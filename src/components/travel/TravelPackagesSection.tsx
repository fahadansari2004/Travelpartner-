"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock, Users, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useGsapReveal } from "@/hooks/useGsapAnimations";

const PACKAGE_TYPES = ["All Packages", "Luxury Expeditions", "Yacht Odysseys", "Alpine Safaris"];

const PACKAGES = [
  {
    id: "nordic-aurora",
    title: "Celestial Aurora Expedition",
    destination: "Tromsø & Svalbard, Norway",
    type: "Luxury Expeditions",
    duration: "8 Days / 7 Nights",
    groupSize: "Max 8 Guests",
    rating: 4.98,
    reviews: 142,
    price: 5400,
    imageUrl: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&q=80",
    badge: "✦ Exclusive Arctic Glass Igloos",
    highlights: ["Private Dog Sledding", "Northern Lights Flight", "Nordic Thermal Spa"],
  },
  {
    id: "mediterranean-odyssey",
    title: "Mediterranean Yacht Odyssey",
    destination: "French Riviera & Amalfi Coast",
    type: "Yacht Odysseys",
    duration: "10 Days / 9 Nights",
    groupSize: "Max 12 Guests",
    rating: 4.96,
    reviews: 98,
    price: 8900,
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    badge: "✦ 120ft Private Superyacht",
    highlights: ["Michelin Private Chef", "Monaco Grand Prix VIP Access", "Hidden Cove Dives"],
  },
  {
    id: "swiss-alpine-safari",
    title: "Swiss Alpine Heli-Safari",
    destination: "Zermatt & St. Moritz, Switzerland",
    type: "Alpine Safaris",
    duration: "7 Days / 6 Nights",
    groupSize: "Max 6 Guests",
    rating: 4.99,
    reviews: 215,
    price: 6800,
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    badge: "✦ Private Helicopter Transfers",
    highlights: ["Matterhorn Heli-Skiing", "Chalet Butler Service", "Glacier Express VIP"],
  },
];

export function TravelPackagesSection() {
  const [activeFilter, setActiveFilter] = useState("All Packages");
  const cardsRef = useGsapReveal<HTMLDivElement>({ stagger: 0.15 });

  const filteredPackages =
    activeFilter === "All Packages"
      ? PACKAGES
      : PACKAGES.filter((p) => p.type === activeFilter);

  return (
    <Section background="slate-950" padding="xl" borderTop borderBottom glow="amber">
      <SectionHeader
        align="between"
        eyebrow={<Badge variant="amber" size="lg">✦ Signature Journeys</Badge>}
        title={<>Curated <span className="gradient-text">Travel Packages</span></>}
        subtitle="Immersive, all-inclusive luxury itineraries crafted for discerning global travelers."
        action={
          <div className="flex flex-wrap gap-2">
            {PACKAGE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === type
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                    : "glass text-slate-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        }
      />

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="group relative glass-card rounded-3xl overflow-hidden border border-slate-800/80 hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            {/* Top Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="glass text-amber-300 font-medium text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-500/30">
                <Sparkles size={13} className="text-amber-400" />
                {pkg.badge}
              </span>
            </div>

            {/* Package Image Header */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={pkg.imageUrl}
                alt={pkg.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />

              {/* Rating Pill overlay */}
              <div className="absolute bottom-4 right-4 z-20 glass px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-slate-100">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span>{pkg.rating}</span>
                <span className="text-slate-500 font-normal">({pkg.reviews})</span>
              </div>
            </div>

            {/* Body Info */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-xs text-amber-400 font-semibold tracking-wide uppercase flex items-center gap-1">
                  <MapPin size={12} className="text-amber-400 shrink-0" />
                  {pkg.destination}
                </p>
                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mt-1">
                  {pkg.title}
                </h3>

                {/* Duration & Group Size Row */}
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-500" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-slate-500" />
                    <span>{pkg.groupSize}</span>
                  </div>
                </div>

                {/* Highlights checklist */}
                <div className="mt-4 space-y-1.5">
                  {pkg.highlights.map((item) => (
                    <div key={item} className="text-xs text-slate-300 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA Row */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Starting From
                  </span>
                  <span className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                    ${pkg.price.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400"> / guest</span>
                  </span>
                </div>
                <Button variant="amber" size="md" rightIcon={<ArrowRight size={14} />}>
                  <Link href={`/booking?package=${pkg.id}`}>Book Package</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
