"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Sparkles, Image as ImageIcon, Video as VideoIcon, 
  MapPin, Calendar, ArrowRight, X, ChevronLeft, ChevronRight, 
  ZoomIn, Play, Film, Folder, Grid
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useStoreData, INITIAL_ALBUMS, AlbumItem } from "@/lib/storage";

export default function GalleryPage() {
  const [albums] = useStoreData<AlbumItem[]>("albums", INITIAL_ALBUMS);

  // Main Section Toggle: "albums" vs "photos"
  const [activeSection, setActiveSection] = useState<"albums" | "photos">("albums");

  // Selected Album for Album Detail Modal
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumItem | null>(null);
  const [mediaTab, setMediaTab] = useState<"photos" | "videos">("photos");

  // Lightbox State for Fullscreen Photo Viewer
  const [lightboxPhotoList, setLightboxPhotoList] = useState<{ url: string; title: string; caption?: string; albumName?: string; location?: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Mobile Auto Carousel Index States
  const [mobileAlbumIndex, setMobileAlbumIndex] = useState(0);
  const [mobilePhotoIndex, setMobilePhotoIndex] = useState(0);

  // Touch Swipe State for Mobile Carousels
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Active albums
  const activeAlbums = useMemo(() => albums.filter((a) => a.active), [albums]);

  // All Individual Photos extracted from all active albums
  const allIndividualPhotos = useMemo(() => {
    const photosList: { id: string; url: string; title: string; caption?: string; albumId: string; albumName: string; category: string; destination: string; country: string }[] = [];
    
    activeAlbums.forEach((album) => {
      if (album.images && album.images.length > 0) {
        album.images.forEach((img, idx) => {
          photosList.push({
            id: img.id || `${album.id}-img-${idx}`,
            url: img.url,
            title: img.title || album.name,
            caption: img.caption,
            albumId: album.id,
            albumName: album.name,
            category: album.category,
            destination: album.destination,
            country: album.country,
          });
        });
      }
    });

    return photosList;
  }, [activeAlbums]);

  const featuredAlbums = useMemo(() => activeAlbums.filter((a) => a.featured), [activeAlbums]);

  // Auto Carousel Timer for Mobile Albums
  useEffect(() => {
    if (activeSection !== "albums" || activeAlbums.length <= 1) return;
    const timer = setInterval(() => {
      setMobileAlbumIndex((prev) => (prev + 1) % activeAlbums.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeSection, activeAlbums.length]);

  // Auto Carousel Timer for Mobile Photos
  useEffect(() => {
    if (activeSection !== "photos" || allIndividualPhotos.length <= 1) return;
    const timer = setInterval(() => {
      setMobilePhotoIndex((prev) => (prev + 1) % allIndividualPhotos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeSection, allIndividualPhotos.length]);

  // Touch handlers for Mobile Albums Swipe
  const handleAlbumTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleAlbumTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.touches[0].clientX;
    if (diff > 40) {
      setMobileAlbumIndex((prev) => (prev + 1) % activeAlbums.length);
      setTouchStartX(null);
    } else if (diff < -40) {
      setMobileAlbumIndex((prev) => (prev === 0 ? activeAlbums.length - 1 : prev - 1));
      setTouchStartX(null);
    }
  };

  // Touch handlers for Mobile Photos Swipe
  const handlePhotoTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handlePhotoTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.touches[0].clientX;
    if (diff > 40) {
      setMobilePhotoIndex((prev) => (prev + 1) % allIndividualPhotos.length);
      setTouchStartX(null);
    } else if (diff < -40) {
      setMobilePhotoIndex((prev) => (prev === 0 ? allIndividualPhotos.length - 1 : prev - 1));
      setTouchStartX(null);
    }
  };

  // Handle Keyboard Navigation for Fullscreen Lightbox
  useEffect(() => {
    if (lightboxIndex === null || lightboxPhotoList.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev === null || prev === 0 ? lightboxPhotoList.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev === null || prev === lightboxPhotoList.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, lightboxPhotoList]);

  // Open Lightbox for individual photo stream
  const openPhotosLightbox = (index: number) => {
    const list = allIndividualPhotos.map((p) => ({
      url: p.url,
      title: p.title,
      caption: p.caption,
      albumName: p.albumName,
      location: `${p.destination}, ${p.country}`,
    }));
    setLightboxPhotoList(list);
    setLightboxIndex(index);
    setIsZoomed(false);
  };

  // Open Lightbox from inside an Album detail modal
  const openAlbumPhotoLightbox = (album: AlbumItem, index: number) => {
    if (!album.images) return;
    const list = album.images.map((img) => ({
      url: img.url,
      title: img.title,
      caption: img.caption,
      albumName: album.name,
      location: `${album.destination}, ${album.country}`,
    }));
    setLightboxPhotoList(list);
    setLightboxIndex(index);
    setIsZoomed(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-4 sm:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={14} /> Visual Experiences & Albums
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-[family-name:var(--font-playfair)] tracking-tight">
            Travel Memories & <span className="gradient-text">Gallery</span>
          </h1>

          <p className="text-lg text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            Discover unforgettable journeys through curated photo stream collections and destination albums from our luxury travel experiences.
          </p>

          {/* ── MAIN SECTION SEGMENT CONTROL TABS (ALBUMS vs PHOTOS) ───── */}
          <div className="flex justify-center pt-4">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-md">
              <button
                onClick={() => setActiveSection("albums")}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
                  activeSection === "albums"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Folder size={16} /> Albums Section ({activeAlbums.length})
              </button>
              <button
                onClick={() => setActiveSection("photos")}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
                  activeSection === "photos"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Grid size={16} /> Photos Section ({allIndividualPhotos.length})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: ALBUMS SECTION ───────────────────────────────────── */}
      {activeSection === "albums" && (
        <div className="space-y-16 py-12">
          {/* Featured Showcase */}
          {featuredAlbums.length > 0 && (
            <section className="px-4 sm:px-8 max-w-7xl mx-auto border-b border-white/10 pb-12">
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="amber" size="md">✦ Featured Collection</Badge>
                <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Signature Expeditions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredAlbums.slice(0, 3).map((album) => (
                  <div
                    key={album.id}
                    onClick={() => { setSelectedAlbum(album); setMediaTab("photos"); }}
                    className="group relative rounded-3xl overflow-hidden cursor-pointer border border-amber-500/30 glass-card aspect-[4/3] flex flex-col justify-end p-6 hover:border-amber-400 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                  >
                    <img
                      src={album.coverImage}
                      alt={album.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                          ★ Featured
                        </span>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                          <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                            <ImageIcon size={12} /> {album.images?.length || 0}
                          </span>
                          {album.videos && album.videos.length > 0 && (
                            <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-white/10 text-amber-400">
                              <Film size={12} /> {album.videos.length}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-white group-hover:text-amber-400 transition-colors">
                        {album.name}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {album.shortDesc}
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-white/15 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-amber-400" /> {album.country}
                        </span>
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                          Explore Album <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Albums Grid (Desktop) & Touch Auto Carousel (Mobile) */}
          <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
                  📁 Travel Albums ({activeAlbums.length})
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Click any album to view full story, photo collection, and video highlights.
                </p>
              </div>
            </div>

            {/* Desktop Grid Layout (sm and larger) */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeAlbums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => { setSelectedAlbum(album); setMediaTab("photos"); }}
                  className="glass-card rounded-3xl overflow-hidden border border-white/10 bg-slate-900/70 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 group cursor-pointer shadow-xl flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={album.coverImage}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                        {album.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold flex items-center gap-1">
                          <ImageIcon size={11} /> {album.images?.length || 0}
                        </span>
                        {album.videos && album.videos.length > 0 && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow-md">
                            <Play size={10} fill="currentColor" /> {album.videos.length}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-4 text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                      <Calendar size={13} className="text-amber-400" /> {album.travelDate}
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-amber-400/90 tracking-wider flex items-center gap-1 mb-1">
                        <MapPin size={12} /> {album.destination}, {album.country}
                      </span>
                      <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-white group-hover:text-amber-400 transition-colors">
                        {album.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                        {album.shortDesc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                        Open Album Collection <ArrowRight size={13} />
                      </span>
                      <span className="text-[10px] text-slate-500">Click to view</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Touch & Auto Carousel (sm:hidden) */}
            <div className="block sm:hidden space-y-4">
              {activeAlbums.length > 0 && (
                <div className="relative">
                  <div
                    onTouchStart={handleAlbumTouchStart}
                    onTouchMove={handleAlbumTouchMove}
                    onClick={() => { setSelectedAlbum(activeAlbums[mobileAlbumIndex]); setMediaTab("photos"); }}
                    className="glass-card rounded-3xl overflow-hidden border border-amber-500/40 bg-slate-900/90 shadow-2xl cursor-pointer transition-all duration-500"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                      <img
                        src={activeAlbums[mobileAlbumIndex].coverImage}
                        alt={activeAlbums[mobileAlbumIndex].name}
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                        <span className="px-3 py-1 rounded-full bg-slate-950/80 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                          {activeAlbums[mobileAlbumIndex].category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-white text-[10px] font-semibold flex items-center gap-1">
                          <ImageIcon size={11} /> {activeAlbums[mobileAlbumIndex].images?.length || 0}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                        <Calendar size={13} className="text-amber-400" /> {activeAlbums[mobileAlbumIndex].travelDate}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <span className="text-[11px] uppercase font-bold text-amber-400 flex items-center gap-1">
                        <MapPin size={12} /> {activeAlbums[mobileAlbumIndex].destination}, {activeAlbums[mobileAlbumIndex].country}
                      </span>
                      <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-white">
                        {activeAlbums[mobileAlbumIndex].name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {activeAlbums[mobileAlbumIndex].shortDesc}
                      </p>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                          Open Album Collection <ArrowRight size={13} />
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Swipe or tap arrows</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Carousel Controls & Indicators */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setMobileAlbumIndex((prev) => (prev === 0 ? activeAlbums.length - 1 : prev - 1))}
                      className="w-10 h-10 rounded-full bg-slate-900 border border-white/15 text-white flex items-center justify-center active:scale-95"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                      {activeAlbums.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setMobileAlbumIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            mobileAlbumIndex === idx ? "w-6 bg-amber-400" : "w-2 bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setMobileAlbumIndex((prev) => (prev + 1) % activeAlbums.length)}
                      className="w-10 h-10 rounded-full bg-slate-900 border border-white/15 text-white flex items-center justify-center active:scale-95"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ── SECTION 2: PHOTOS SECTION ───────────────────────────────────── */}
      {activeSection === "photos" && (
        <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
                📷 Individual Photo Stream ({allIndividualPhotos.length})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore individual high-definition moments. Click any image to view in instant fullscreen Lightbox.
              </p>
            </div>
          </div>

          {/* Desktop Photos Grid (sm and larger) */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allIndividualPhotos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => openPhotosLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-square bg-slate-900 cursor-pointer shadow-xl hover:border-amber-400 transition-all duration-300 hover:-translate-y-1.5"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold uppercase truncate max-w-[150px]">
                    📁 {photo.albumName}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <ZoomIn size={14} />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider flex items-center gap-1">
                    <MapPin size={10} /> {photo.destination}, {photo.country}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                    {photo.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Photos Auto Carousel (sm:hidden) */}
          <div className="block sm:hidden space-y-4">
            {allIndividualPhotos.length > 0 && (
              <div className="relative">
                <div
                  onTouchStart={handlePhotoTouchStart}
                  onTouchMove={handlePhotoTouchMove}
                  onClick={() => openPhotosLightbox(mobilePhotoIndex)}
                  className="group relative rounded-3xl overflow-hidden border border-amber-500/40 aspect-square bg-slate-900 cursor-pointer shadow-2xl"
                >
                  <img
                    src={allIndividualPhotos[mobilePhotoIndex].url}
                    alt={allIndividualPhotos[mobilePhotoIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 text-amber-400 text-[10px] font-bold uppercase">
                      📁 {allIndividualPhotos[mobilePhotoIndex].albumName}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                      <ZoomIn size={16} />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                    <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                      <MapPin size={12} /> {allIndividualPhotos[mobilePhotoIndex].destination}, {allIndividualPhotos[mobilePhotoIndex].country}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {allIndividualPhotos[mobilePhotoIndex].title}
                    </h4>
                  </div>
                </div>

                {/* Mobile Carousel Indicators */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setMobilePhotoIndex((prev) => (prev === 0 ? allIndividualPhotos.length - 1 : prev - 1))}
                    className="w-10 h-10 rounded-full bg-slate-900 border border-white/15 text-white flex items-center justify-center active:scale-95"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-2 overflow-x-auto max-w-[180px] py-1">
                    {allIndividualPhotos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMobilePhotoIndex(idx)}
                        className={`h-2 rounded-full shrink-0 transition-all ${
                          mobilePhotoIndex === idx ? "w-6 bg-amber-400" : "w-2 bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setMobilePhotoIndex((prev) => (prev + 1) % allIndividualPhotos.length)}
                    className="w-10 h-10 rounded-full bg-slate-900 border border-white/15 text-white flex items-center justify-center active:scale-95"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 100% TRACKPAD & MOBILE SCROLLABLE UNIFIED ALBUM MODAL ────────── */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl p-3 sm:p-8 animate-in fade-in duration-300 touch-pan-y">
          <div className="min-h-full flex items-center justify-center py-4 sm:py-6">
            
            {/* Single Unified Album Card Container */}
            <div className="relative w-full max-w-4xl bg-slate-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-3.5 sm:p-8 space-y-5 my-auto">
              
              {/* Cover Image Banner with Absolute Close Button */}
              <div className="relative h-52 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                <img
                  src={selectedAlbum.coverImage}
                  alt={selectedAlbum.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Absolute Top-Right Close Button */}
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 border border-white/20 text-slate-300 hover:text-white hover:bg-amber-500 hover:border-amber-500 hover:text-slate-950 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
                  title="Close Album"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 space-y-1.5 z-10">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                      {selectedAlbum.category}
                    </span>
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-950/80 border border-white/20 text-slate-300 text-[10px] font-semibold flex items-center gap-1">
                      <MapPin size={11} className="text-amber-400" /> {selectedAlbum.destination}, {selectedAlbum.country}
                    </span>
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-950/80 border border-white/20 text-slate-300 text-[10px] font-semibold flex items-center gap-1">
                      <Calendar size={11} className="text-amber-400" /> {selectedAlbum.travelDate}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-4xl font-bold font-[family-name:var(--font-playfair)] text-white">
                    {selectedAlbum.name}
                  </h2>
                </div>
              </div>

              {/* Description Story */}
              <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/10 bg-slate-950/60 space-y-1.5">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase text-amber-400 tracking-wider">Travel Story & Expedition Overview</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {selectedAlbum.longDesc || selectedAlbum.shortDesc}
                </p>
              </div>

              {/* Media Tabs (Photos vs Videos) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMediaTab("photos")}
                    className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      mediaTab === "photos"
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                    }`}
                  >
                    <ImageIcon size={14} /> Photos ({selectedAlbum.images?.length || 0})
                  </button>
                  <button
                    onClick={() => setMediaTab("videos")}
                    className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      mediaTab === "videos"
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                    }`}
                  >
                    <Film size={14} /> Videos ({selectedAlbum.videos?.length || 0})
                  </button>
                </div>

                {selectedAlbum.relatedPackageId && (
                  <Link href="/packages">
                    <Button variant="amber" size="sm" rightIcon={<ArrowRight size={14} />}>
                      View Tour Package
                    </Button>
                  </Link>
                )}
              </div>

              {/* Photos Gallery Grid */}
              {mediaTab === "photos" && (
                <div>
                  {(!selectedAlbum.images || selectedAlbum.images.length === 0) ? (
                    <p className="text-center py-8 text-slate-400 text-xs">No photos uploaded to this album yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {selectedAlbum.images.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          onClick={() => openAlbumPhotoLightbox(selectedAlbum, idx)}
                          className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] sm:aspect-square bg-slate-950 cursor-pointer shadow-md hover:border-amber-400 transition-all duration-300"
                        >
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-90 transition-opacity p-2.5 sm:p-4 flex flex-col justify-end">
                            <span className="text-[11px] sm:text-xs font-bold text-white flex items-center justify-between">
                              <span className="truncate">{img.title}</span>
                              <ZoomIn size={14} className="text-amber-400 shrink-0 ml-1" />
                            </span>
                            {img.caption && <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-1">{img.caption}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Videos Gallery Grid */}
              {mediaTab === "videos" && (
                <div>
                  {(!selectedAlbum.videos || selectedAlbum.videos.length === 0) ? (
                    <p className="text-center py-12 text-slate-400 text-xs">No video highlights uploaded to this album yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedAlbum.videos.map((vid, idx) => (
                        <div key={vid.id || idx} className="glass-card rounded-2xl overflow-hidden border border-white/10 p-4 space-y-3 bg-slate-950/60">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                            <video
                              src={vid.url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white">{vid.title}</h5>
                            {vid.caption && <p className="text-xs text-slate-400">{vid.caption}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer Close Button */}
              <div className="pt-6 pb-2 text-center border-t border-white/10">
                <Button variant="amber" size="sm" onClick={() => setSelectedAlbum(null)}>
                  Close Album Window
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── FULLSCREEN LIGHTBOX VIEWER FOR PHOTOS ──────────────────────── */}
      {lightboxIndex !== null && lightboxPhotoList.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Controls Bar */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white z-20" onClick={(e) => e.stopPropagation()}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {lightboxPhotoList[lightboxIndex]?.albumName || "Photo Stream"}
              </span>
              <p className="text-sm font-semibold">
                Photo {lightboxIndex + 1} of {lightboxPhotoList.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                title="Toggle Zoom"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                title="Close Fullscreen Lightbox"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Previous Button */}
          {lightboxPhotoList.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === null || prev === 0 ? lightboxPhotoList.length - 1 : prev - 1));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image Display */}
          <div
            className="max-w-5xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center p-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPhotoList[lightboxIndex]?.url}
              alt={lightboxPhotoList[lightboxIndex]?.title}
              className={`max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/10 shadow-2xl transition-transform duration-300 ${
                isZoomed ? "scale-125 cursor-zoom-out" : "scale-100 cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />

            <div className="mt-4 text-center max-w-lg space-y-1">
              <h4 className="text-base font-bold text-white">{lightboxPhotoList[lightboxIndex]?.title}</h4>
              {lightboxPhotoList[lightboxIndex]?.location && (
                <p className="text-xs font-semibold text-amber-400">{lightboxPhotoList[lightboxIndex]?.location}</p>
              )}
              {lightboxPhotoList[lightboxIndex]?.caption && (
                <p className="text-xs text-slate-300">{lightboxPhotoList[lightboxIndex]?.caption}</p>
              )}
            </div>
          </div>

          {/* Next Button */}
          {lightboxPhotoList.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === null || prev === lightboxPhotoList.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}

      <Footer />
    </main>
  );
}
