"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, MapPin, Camera, X } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { useGsapReveal } from "@/hooks/useGsapAnimations";

const GALLERY_ITEMS = [
  {
    id: "g1",
    title: "Amalfi Coast Cliffside",
    location: "Positano, Italy",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    aspect: "aspect-[3/4]",
    photographer: "@marco_travels",
  },
  {
    id: "g2",
    title: "Kyoto Autumn Bamboo Forest",
    location: "Kyoto, Japan",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    aspect: "aspect-[4/3]",
    photographer: "@sakura_views",
  },
  {
    id: "g3",
    title: "Overwater Villa Sunset",
    location: "Maldives",
    imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    aspect: "aspect-[3/4]",
    photographer: "@ocean_breeze",
  },
  {
    id: "g4",
    title: "Serengeti Migration",
    location: "Tanzania, Africa",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    aspect: "aspect-[16/10]",
    photographer: "@safari_journal",
  },
  {
    id: "g5",
    title: "Santorini Blue Domes",
    location: "Santorini, Greece",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    aspect: "aspect-[3/4]",
    photographer: "@aegean_dream",
  },
  {
    id: "g6",
    title: "Swiss Alps Helicopter Peak",
    location: "Zermatt, Switzerland",
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    aspect: "aspect-[4/3]",
    photographer: "@alpine_peak",
  },
];

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_ITEMS[0] | null>(null);
  const containerRef = useGsapReveal<HTMLDivElement>({ stagger: 0.1 });

  return (
    <Section background="slate-900" padding="xl" borderTop borderBottom glow="cool">
      <SectionHeader
        align="center"
        eyebrow={<Badge variant="cyan" size="lg">✦ Visual Memoirs</Badge>}
        title={<>Traveler <span className="gradient-text-cool">Moments</span></>}
        subtitle="Unfiltered moments captured by our guests across extraordinary destinations."
      />

      {/* Pinterest-Style Masonry Grid */}
      <div
        ref={containerRef}
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto"
      >
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative glass-card rounded-3xl overflow-hidden cursor-pointer border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-500 break-inside-avoid"
          >
            {/* Image */}
            <div className={`relative ${item.aspect} w-full overflow-hidden`}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-between p-6">
                <div className="flex justify-end">
                  <span className="w-10 h-10 rounded-full glass flex items-center justify-center text-white">
                    <Maximize2 size={16} />
                  </span>
                </div>
                <div>
                  <span className="text-xs text-cyan-400 font-semibold tracking-wide flex items-center gap-1">
                    <MapPin size={12} /> {item.location}
                  </span>
                  <h4 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)] mt-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Camera size={12} /> {item.photographer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card rounded-3xl overflow-hidden max-w-4xl w-full border border-white/20 p-2 shadow-2xl"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full glass text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                  <MapPin size={12} /> {selectedImage.location}
                </span>
                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mt-0.5">
                  {selectedImage.title}
                </h3>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Camera size={14} /> {selectedImage.photographer}
              </span>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
