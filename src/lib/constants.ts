import type { NavLink } from "./types";

// ─── Site Metadata ────────────────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: "travelPartner TOURS AND TRAVELS",
  tagline: "PLAN A BETTER THRILL...",
  description:
    "Premium travel experiences curated for the modern explorer. Breathtaking destinations, seamless booking, unforgettable memories.",
  url: "https://travelpartner.com",
  contact: {
    email: "info@travelpartner.com",
    phone: "+1 (800) 555-TRAVEL",
    address: "123 Explorer Way, San Francisco, CA 94105",
  },
  social: {
    instagram: "https://instagram.com/travelpartner",
    twitter: "https://twitter.com/travelpartner",
    facebook: "https://facebook.com/travelpartner",
    youtube: "https://youtube.com/travelpartner",
  },
} as const;

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

// ─── Destination Categories ───────────────────────────────────────────────────
export const DESTINATION_CATEGORIES = [
  { value: "all", label: "All Destinations", emoji: "🌍" },
  { value: "beach", label: "Beach & Coast", emoji: "🏖️" },
  { value: "mountain", label: "Mountains", emoji: "⛰️" },
  { value: "city", label: "City Breaks", emoji: "🏙️" },
  { value: "cultural", label: "Cultural", emoji: "🏛️" },
  { value: "adventure", label: "Adventure", emoji: "🧗" },
  { value: "luxury", label: "Luxury", emoji: "💎" },
  { value: "wildlife", label: "Wildlife", emoji: "🦁" },
] as const;

// ─── Price Tiers ──────────────────────────────────────────────────────────────
export const PRICE_TIERS = [
  { label: "Budget", min: 0, max: 1000 },
  { label: "Mid-range", min: 1000, max: 3000 },
  { label: "Premium", min: 3000, max: 7000 },
  { label: "Luxury", min: 7000, max: 50000 },
] as const;

// ─── Sort Options ─────────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
] as const;

// ─── GSAP Default Eases ───────────────────────────────────────────────────────
export const EASE = {
  smooth: "power2.out",
  spring: "elastic.out(1, 0.5)",
  sharp: "expo.out",
  bounce: "back.out(1.7)",
  linear: "none",
} as const;

// ─── Lenis Config ────────────────────────────────────────────────────────────
export const LENIS_CONFIG = {
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
} as const;
