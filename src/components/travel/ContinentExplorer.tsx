"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe2, MapPin, ArrowRight, Star, Compass, Navigation } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockDestinations } from "@/data/mockDestinations";

const CONTINENTS = [
  { id: "europe", label: "Europe", emoji: "🏛️", region: "Europe", coords: "48.8566° N, 2.3522° E" },
  { id: "asia", label: "Asia", emoji: "🏯", region: "East Asia", coords: "35.6762° N, 139.6503° E" },
  { id: "southeast-asia", label: "SE Asia", emoji: "🏝️", region: "Southeast Asia", coords: "8.4095° S, 115.1889° E" },
  { id: "americas", label: "South America", emoji: "⛰️", region: "South America", coords: "13.1631° S, 72.5450° W" },
  { id: "africa", label: "Africa", emoji: "🦁", region: "Africa", coords: "2.3333° S, 34.8333° E" },
];

export function ContinentExplorer() {
  const [activeContinent, setActiveContinent] = useState(CONTINENTS[0]);

  const filteredDestinations = mockDestinations.filter(
    (d) =>
      d.region === activeContinent.region ||
      (activeContinent.id === "asia" &&
        (d.region === "East Asia" || d.region === "Southeast Asia"))
  );

  return (
    <Section background="slate-950" padding="xl" borderTop borderBottom glow="cool">
      <SectionHeader
        align="center"
        eyebrow={<Badge variant="purple" size="lg">✦ Global Continent Explorer</Badge>}
        title={<>Fly Across <span className="gradient-text-cool">Continents</span></>}
        subtitle="Select a continent to watch the 3D globe rotate in real-time behind the page."
      />

      {/* Continent Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {CONTINENTS.map((cont) => (
          <button
            key={cont.id}
            onClick={() => setActiveContinent(cont)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeContinent.id === cont.id
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/25 scale-105"
                : "glass text-slate-300 hover:text-white hover:border-purple-500/30"
            }`}
          >
            <span>{cont.emoji}</span>
            <span>{cont.label}</span>
          </button>
        ))}
      </div>

      {/* Radar Flight Dashboard + Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
        {/* Left: Flight Radar Telemetry Dashboard */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
                {activeContinent.label} Radar Telemetry
              </h3>
            </div>
            <span className="glass text-xs text-cyan-300 px-3 py-1 rounded-full">
              LIVE 3D SYNC
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="glass p-4 rounded-2xl flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Navigation size={14} className="text-cyan-400" /> Target Coordinates
              </span>
              <span className="text-xs font-mono font-bold text-slate-100">
                {activeContinent.coords}
              </span>
            </div>

            <div className="glass p-4 rounded-2xl flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Globe2 size={14} className="text-amber-400" /> Primary Region
              </span>
              <span className="text-xs font-bold text-amber-400">
                {activeContinent.region}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <p className="text-xs text-slate-400 leading-relaxed">
                ✦ Watch the global 3D Earth in the background smoothly orient toward {activeContinent.label} while scrolling or switching tabs.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Focused Continent Destinations List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
              {activeContinent.label} Highlights
            </h3>
            <span className="text-xs text-slate-500">
              {filteredDestinations.length} Packages
            </span>
          </div>

          <div className="space-y-3">
            {filteredDestinations.slice(0, 3).map((dest) => (
              <div
                key={dest.id}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-amber-500/30 transition-all group"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={dest.imageUrl}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-white font-[family-name:var(--font-playfair)] truncate">
                      {dest.name}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-200">{dest.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={11} className="text-slate-500 shrink-0" />
                    <span className="truncate">{dest.country}</span>
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                    <span className="text-xs font-bold text-amber-400">
                      ${dest.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/booking?destination=${dest.id}`}
                      className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Book <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="md" fullWidth rightIcon={<Compass size={15} />}>
            <Link href={`/destinations?category=${activeContinent.id}`}>
              Explore All {activeContinent.label} Trips
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
