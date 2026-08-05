"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DestinationCard } from "@/components/travel/DestinationCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { mockDestinations } from "@/data/mockDestinations";
import { DESTINATION_CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import type { Destination, DestinationCategory, SortOption } from "@/lib/types";
import { useGsapReveal } from "@/hooks/useGsapAnimations";

function DestinationsContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as DestinationCategory | "all") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | "all">(initialCategory);
  const [selectedSort, setSelectedSort] = useState<SortOption>("featured");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(7000);
  const [quickViewDest, setQuickViewDest] = useState<Destination | null>(null);

  // Filter logic
  const filteredDestinations = useMemo(() => {
    return mockDestinations
      .filter((dest) => {
        // Search filter
        if (
          searchQuery &&
          !dest.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !dest.country.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !dest.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return false;
        }

        // Category filter
        if (selectedCategory !== "all" && dest.category !== selectedCategory) {
          return false;
        }

        // Price filter
        if (dest.price > maxPriceFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price-asc") return a.price - b.price;
        if (selectedSort === "price-desc") return b.price - a.price;
        if (selectedSort === "rating") return b.rating - a.rating;
        if (selectedSort === "name") return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [searchQuery, selectedCategory, selectedSort, maxPriceFilter]);

  const gridRef = useGsapReveal<HTMLDivElement>({ stagger: 0.08, start: "top 90%" });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-10 text-center sm:text-left">
          <Badge variant="amber" size="lg" className="mb-3">
            Explore Destinations
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Find Your Next <span className="gradient-text">Escape</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-xl">
            Browse our curated collection of extraordinary journeys across all seven continents.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="w-full md:w-80">
            <Input
              id="catalog-search"
              placeholder="Search by destination or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
              rightIcon={
                searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                ) : undefined
              }
            />
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium shrink-0">
              Max Price: <strong className="text-amber-400">${maxPriceFilter.toLocaleString()}</strong>
            </span>
            <input
              type="range"
              min="1000"
              max="7000"
              step="500"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full md:w-36 accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal size={16} className="text-slate-400 shrink-0" />
            <select
              id="sort-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              className="w-full md:w-auto h-11 bg-slate-900 border border-slate-700/60 rounded-xl px-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort by: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {DESTINATION_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value as DestinationCategory | "all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all ${
                selectedCategory === cat.value
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20"
                  : "glass text-slate-300 hover:text-white hover:border-amber-500/30"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-slate-400">
            Showing <strong className="text-slate-200">{filteredDestinations.length}</strong> destinations
          </p>
          {(searchQuery || selectedCategory !== "all" || maxPriceFilter < 7000) && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setMaxPriceFilter(7000);
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Catalog Grid */}
        {filteredDestinations.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onQuickView={(d) => setQuickViewDest(d)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center my-12">
            <Filter size={36} className="mx-auto text-slate-500 mb-3" />
            <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-playfair)]">
              No destinations found
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Try adjusting your search query, price slider, or category filter.
            </p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewDest && (
        <Modal
          isOpen={!!quickViewDest}
          onClose={() => setQuickViewDest(null)}
          title={quickViewDest.name}
          description={`${quickViewDest.country} · ${quickViewDest.region}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <Image
                src={quickViewDest.imageUrl}
                alt={quickViewDest.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {quickViewDest.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {quickViewDest.highlights.map((h) => (
                <Badge key={h} variant="amber" size="sm">
                  ✦ {h}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div>
                <span className="text-xs text-slate-400">Starting from</span>
                <p className="text-2xl font-bold text-amber-400">
                  ${quickViewDest.price.toLocaleString()}
                </p>
              </div>
              <Button variant="amber" size="md" onClick={() => setQuickViewDest(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

export default function DestinationsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-slate-950 pt-28 text-center text-slate-400">Loading catalog...</div>}>
        <DestinationsContent />
      </Suspense>
      <Footer />
    </>
  );
}
