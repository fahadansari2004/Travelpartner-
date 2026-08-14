import { useState, useMemo } from "react";
import Link from "next/link";
import { Maximize2, MapPin, Camera, X, ArrowRight, Folder } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useGsapReveal } from "@/hooks/useGsapAnimations";
import { useStoreData, INITIAL_ALBUMS, AlbumItem } from "@/lib/storage";

export function GallerySection() {
  const [albums] = useStoreData<AlbumItem[]>("albums", INITIAL_ALBUMS);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; location: string; photographer?: string } | null>(null);
  const containerRef = useGsapReveal<HTMLDivElement>({ stagger: 0.1 });

  const activeAlbums = useMemo(() => (albums || []).filter((a) => a && a.active !== false), [albums]);

  // Extract individual photo stream items from active albums
  const displayPhotos = useMemo(() => {
    const list: { id: string; url: string; title: string; location: string; photographer: string; aspect: string }[] = [];
    const aspects = ["aspect-[3/4]", "aspect-[4/3]", "aspect-[16/10]", "aspect-square"];
    
    activeAlbums.forEach((alb, albIdx) => {
      if (alb.images && alb.images.length > 0) {
        alb.images.forEach((img, imgIdx) => {
          list.push({
            id: img.id || `alb-${albIdx}-img-${imgIdx}`,
            url: img.url,
            title: img.title || alb.name,
            location: `${alb.destination || "Expedition"}, ${alb.country || "Global"}`,
            photographer: img.caption || `@${alb.category.toLowerCase()}_expedition`,
            aspect: aspects[(albIdx + imgIdx) % aspects.length],
          });
        });
      } else if (alb.coverImage) {
        list.push({
          id: alb.id,
          url: alb.coverImage,
          title: alb.name,
          location: `${alb.destination}, ${alb.country}`,
          photographer: `@${alb.category.toLowerCase()}_expedition`,
          aspect: aspects[albIdx % aspects.length],
        });
      }
    });

    if (list.length === 0) {
      return [
        { id: "f1", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80", title: "Maldives Overwater Haven", location: "Maldives", photographer: "@maldives_expedition", aspect: "aspect-[4/3]" },
        { id: "f2", url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80", title: "Matterhorn Peak View", location: "Switzerland", photographer: "@swiss_mountains", aspect: "aspect-[3/4]" },
        { id: "f3", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80", title: "Dubai Skyline Sunset", location: "UAE", photographer: "@dubai_luxury", aspect: "aspect-[16/10]" },
        { id: "f4", url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80", title: "Santorini Oia Caldera", location: "Greece", photographer: "@greece_travel", aspect: "aspect-square" },
      ];
    }

    return list;
  }, [activeAlbums]);

  return (
    <Section background="slate-900" padding="xl" borderTop borderBottom glow="cool">
      <SectionHeader
        align="center"
        eyebrow={
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-center">
            ✦ Visual Memoirs & Photo Stream
          </span>
        }
        title={
          <span className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-snug block text-center">
            Guest & Expedition <span className="gradient-text">Moments</span>
          </span>
        }
        subtitle="Unfiltered moments captured by our guests across extraordinary travel albums."
        className="px-2"
      />

      <div className="flex justify-center mb-8">
        <Link href="/gallery">
          <Button variant="amber" size="sm" leftIcon={<Folder size={14} />} rightIcon={<ArrowRight size={14} />}>
            Explore All Albums & Media Gallery ({activeAlbums.length || 4})
          </Button>
        </Link>
      </div>

      {/* Desktop Pinterest-Style Masonry Grid */}
      <div
        ref={containerRef}
        className="hidden sm:block sm:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto"
      >
        {displayPhotos.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative glass-card rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-400/50 transition-all duration-500 break-inside-avoid bg-slate-950"
          >
            {/* Image */}
            <div className={`relative ${item.aspect} w-full overflow-hidden`}>
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-between p-6">
                <div className="flex justify-end">
                  <span className="w-10 h-10 rounded-full glass flex items-center justify-center text-white bg-black/40 border border-white/20">
                    <Maximize2 size={16} />
                  </span>
                </div>
                <div>
                  <span className="text-xs text-amber-400 font-semibold tracking-wide flex items-center gap-1">
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

      {/* Mobile Horizontal Touch-Swipeable Card Carousel */}
      <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-4 px-4 touch-pan-x">
        {displayPhotos.map((item) => (
          <div
            key={`m-${item.id}`}
            onClick={() => setSelectedImage(item)}
            className="snap-start shrink-0 w-[270px] glass-card rounded-3xl overflow-hidden cursor-pointer border border-white/15 bg-slate-950 shadow-xl flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="w-8 h-8 rounded-full glass flex items-center justify-center text-white bg-black/50 border border-white/20">
                  <Maximize2 size={14} />
                </span>
              </div>
            </div>
            <div className="p-4 space-y-1 bg-slate-900/90">
              <span className="text-[10px] text-amber-400 font-semibold tracking-wide flex items-center gap-1">
                <MapPin size={10} /> {item.location}
              </span>
              <h4 className="text-base font-bold text-white font-[family-name:var(--font-playfair)] line-clamp-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Camera size={10} /> {item.photographer}
              </p>
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
            className="relative glass-card rounded-3xl overflow-hidden max-w-4xl w-full border border-white/20 p-2 shadow-2xl bg-slate-900"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full glass text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
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
