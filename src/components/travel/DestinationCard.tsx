"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, ArrowRight, Heart } from "lucide-react";
import { useState, memo } from "react";
import type { Destination } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface DestinationCardProps {
  destination: Destination;
  className?: string;
  onQuickView?: (destination: Destination) => void;
}

const categoryColors: Record<string, string> = {
  beach:     "info",
  mountain:  "purple",
  city:      "default",
  cultural:  "warning",
  adventure: "danger",
  luxury:    "amber",
  wildlife:  "success",
};

const difficultyLabels: Record<string, string> = {
  easy:        "Easy",
  moderate:    "Moderate",
  challenging: "Challenging",
};

export const DestinationCard = memo(function DestinationCard({ destination, className, onQuickView }: DestinationCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-slate-900 border border-slate-800/60",
        "hover:border-amber-500/20 transition-all duration-500",
        "card-hover",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

        {/* Top Row Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={categoryColors[destination.category] as "info" | "purple" | "default" | "warning" | "danger" | "amber" | "success"}
              size="sm"
            >
              {destination.category}
            </Badge>
            {destination.featured && (
              <Badge variant="amber" size="sm">
                ✦ Featured
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "p-2 rounded-xl backdrop-blur-sm transition-all duration-200",
              isWishlisted
                ? "bg-red-500/20 border border-red-500/40 text-red-400"
                : "bg-black/30 border border-white/10 text-slate-300 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400"
            )}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Price — bottom of image */}
        <div className="absolute bottom-3 left-3">
          <div className="glass rounded-xl px-3 py-1.5">
            <span className="text-xs text-slate-400">from</span>
            <span className="text-lg font-bold text-amber-400 ml-1">
              ${destination.price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-0.5">/ person</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <MapPin size={12} />
          <span>{destination.country} · {destination.region}</span>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-slate-50 font-[family-name:var(--font-playfair)] leading-tight">
          {destination.name}
        </h3>

        {/* Short description */}
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed line-clamp-2 flex-1">
          {destination.shortDescription}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/60">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-slate-200">{destination.rating}</span>
            <span className="text-xs text-slate-500">({(destination.reviewCount / 1000).toFixed(1)}k)</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={12} />
            <span>{destination.duration}</span>
          </div>

          {/* Difficulty */}
          <Badge
            variant={
              destination.difficulty === "easy" ? "success" :
              destination.difficulty === "moderate" ? "warning" : "danger"
            }
            size="sm"
          >
            {difficultyLabels[destination.difficulty]}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onQuickView?.(destination)}
          >
            Quick View
          </Button>
          <Link
            href={`/booking?destination=${destination.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 h-8 px-3.5 text-sm font-medium rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200"
          >
            Book Now <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
});
