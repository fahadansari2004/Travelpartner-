"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Tag, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useGsapReveal } from "@/hooks/useGsapAnimations";

const SPECIAL_FARES = [
  {
    id: "bali-indonesia",
    title: "Bali Tropical Escape",
    destination: "Bali, Indonesia",
    originalPrice: 2499,
    salePrice: 1799,
    discount: "28% OFF",
    expiresIn: "4 Days Left",
    category: "Beach & Wellness",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    features: ["5★ Resort Stay", "Daily Breakfast", "Free Spa Voucher"],
  },
  {
    id: "santorini-greece",
    title: "Aegean Sunset Villa",
    destination: "Santorini, Greece",
    originalPrice: 4200,
    salePrice: 3199,
    discount: "24% OFF",
    expiresIn: "2 Days Left",
    category: "Luxury Honeymoon",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    features: ["Caldera Suite", "Private Infinity Pool", "Catamaran Cruise"],
  },
  {
    id: "kyoto-japan",
    title: "Kyoto Heritage Tour",
    destination: "Kyoto, Japan",
    originalPrice: 3500,
    salePrice: 2750,
    discount: "21% OFF",
    expiresIn: "6 Days Left",
    category: "Cultural Exploration",
    imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    features: ["Tea Ceremony Pass", "Bullet Train Pass", "Traditional Ryokan"],
  },
];

export function SpecialFaresSection() {
  const cardsRef = useGsapReveal<HTMLDivElement>({ stagger: 0.15 });

  return (
    <Section background="slate-900" padding="xl" borderTop borderBottom glow="amber">
      <SectionHeader
        align="between"
        eyebrow={<Badge variant="amber" size="lg">✦ Limited Time Deals</Badge>}
        title={<>Exclusive <span className="gradient-text">Special Fares</span></>}
        subtitle="Unbeatable seasonal discounts on our highest-rated luxury travel experiences."
        action={
          <Button variant="outline" rightIcon={<ArrowRight size={15} />}>
            <Link href="/destinations">View All Offers</Link>
          </Button>
        }
      />

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SPECIAL_FARES.map((offer) => (
          <div
            key={offer.id}
            className="group relative glass-card rounded-3xl overflow-hidden border border-slate-800/80 hover:border-amber-500/30 transition-all duration-500 card-hover flex flex-col justify-between"
          >
            {/* Discount Badge */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Zap size={12} className="fill-slate-950" /> {offer.discount}
              </span>
              <span className="glass text-slate-300 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Clock size={12} className="text-amber-400" /> {offer.expiresIn}
              </span>
            </div>

            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-amber-400 font-semibold tracking-wide uppercase mb-1">
                  {offer.category}
                </p>
                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Tag size={12} className="text-slate-500" /> {offer.destination}
                </p>

                {/* Features list */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5">
                  {offer.features.map((feat) => (
                    <div key={feat} className="text-xs text-slate-300 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 line-through block">
                    ${offer.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl font-bold text-amber-400 font-[family-name:var(--font-playfair)]">
                    ${offer.salePrice.toLocaleString()}
                  </span>
                </div>
                <Button variant="amber" size="sm" rightIcon={<ArrowRight size={14} />}>
                  <Link href={`/booking?destination=${offer.id}`}>Claim Deal</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
