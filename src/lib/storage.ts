"use client";

import { useState, useEffect } from "react";

// ─── Data Interfaces ──────────────────────────────────────────────────────────
export interface ServiceItem {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  iconName?: string;
  image?: string;
  shortDesc: string;
  longDesc?: string;
  description?: string;
  ctaText?: string;
  displayOrder?: number;
  active: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  destination: string;
  duration: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  active: boolean;
  shortDesc?: string;
  description?: string;
  itinerary?: { day: number; title: string; desc: string }[];
  gallery?: string[];
  included?: string[];
  excluded?: string[];
  mapLocation?: string;
  videoUrl?: string;
}

export interface FlightFare {
  id: string;
  airlineName: string;
  airlineLogo?: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  tripType: "One Way" | "Round Trip";
  travelClass: "Economy" | "Business" | "First Class";
  travelDate?: string;
  duration?: string;
  farePrice: number;
  currency?: string;
  offerBadge?: string;
  seatsAvailable?: number;
  bookingLink?: string;
  featured?: boolean;
  active: boolean;
}

export interface HotelItem {
  id: string;
  name: string;
  location: string;
  image?: string;
  images?: string[];
  rating: number;
  pricePerNight: number;
  currency?: string;
  facilities?: string[];
  description?: string;
  bookingLink?: string;
  featured: boolean;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  category: "Destinations" | "Resorts" | "Experiences" | "Aerial" | "Packages";
  album?: string;
  active: boolean;
}

export interface AlbumMedia {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  caption?: string;
  displayOrder: number;
}

export interface AlbumItem {
  id: string;
  name: string;
  destination: string;
  country: string;
  category: string;
  coverImage: string;
  shortDesc: string;
  longDesc: string;
  travelDate: string;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  images: AlbumMedia[];
  videos: AlbumMedia[];
  relatedPackageId?: string;
}

export interface MediaLibraryItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  category: "Gallery" | "Package" | "Hotel" | "Hero" | "Destination";
  uploadDate: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  location?: string;
  avatar: string;
  rating: number;
  trip: string;
  comment: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: "General" | "Package" | "Flight" | "Hotel" | "Visa";
  subject: string;
  message: string;
  date: string;
  status: "New" | "Read" | "Contacted" | "Closed";
  preferredTime?: string;
  travelDate?: string;
  guestsCount?: number;
  packageOrItemName?: string;
  totalAmount?: number;
  additionalGuests?: string;
}

export interface FooterSettings {
  brandDescription: string;
  email: string;
  phone: string;
  address: string;
  newsletterHeading: string;
  newsletterSubtitle?: string;
  copyrightText?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export interface AboutSettings {
  title: string;
  subtitle: string;
  storyText: string;
  philosophyText: string;
  yearsExperience: string;
  vipClients: string;
  satisfactionRate: string;
  conciergeSupport: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  openingHours: string;
  whatsappNumber: string;
  mapEmbedUrl: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  twitterCard: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  desc: string;
}

export interface WhyChooseSettings {
  sectionTitle: string;
  items: WhyChooseItem[];
}

export interface MainPageSettings {
  heroHeadline: string;
  heroSubtitle: string;
  heroMediaUrl: string;
  heroCtaText: string;
  aboutTitle: string;
  aboutSubtitle: string;
  servicesTitle: string;
  servicesSubtitle: string;
  destinationsTitle: string;
  destinationsSubtitle: string;
  packagesTitle: string;
  packagesSubtitle: string;
  flightsTitle: string;
  flightsSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  faqTitle: string;
  faqSubtitle: string;
}

// ─── Initial Mock Data Definitions ────────────────────────────────────────────
export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "serv-1",
    name: "Private Jet Charters",
    iconName: "Plane",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Point-to-point VIP aviation on global luxury fleets.",
    longDesc: "Direct tarmac access, gourmet in-flight dining, and custom flight schedules tailored precisely to your journey.",
    ctaText: "Request Jet",
    displayOrder: 1,
    active: true,
  },
  {
    id: "serv-2",
    name: "5-Star Luxury Resorts",
    iconName: "Hotel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Overwater villas, private islands & heritage estates.",
    longDesc: "Hand-picked luxury accommodations featuring complimentary room upgrades, early check-ins, and butler service.",
    ctaText: "Explore Hotels",
    displayOrder: 2,
    active: true,
  },
];

export const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: "pkg-1",
    name: "Swiss Alps Luxury & Glacier Chalets",
    destination: "Zermatt, Switzerland",
    duration: "7 Days / 6 Nights",
    price: 4999,
    discountPrice: 4299,
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviewsCount: 128,
    featured: true,
    active: true,
    shortDesc: "Experience Switzerland at its highest pinnacle. Private helicopter tours around Matterhorn peak.",
    description: "Experience Switzerland at its highest pinnacle. Private helicopter tours around Matterhorn peak, fondue dinners on glacier summits, and stays at 5-star grand hotels.",
    itinerary: [
      { day: 1, title: "Arrival in Zurich & Private Transfer", desc: "VIP limousine transfer to St. Moritz." },
      { day: 2, title: "Glacier Express First Class Journey", desc: "Panoramas across Landwasser Viaduct to Zermatt." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80"
    ],
    included: ["5-Star Hotel Stay", "Private Helicopter Tour", "First Class Glacier Express", "Daily Breakfast & Wine Tasting"],
    excluded: ["International Flights", "Personal Expenses"],
  }
];

export const INITIAL_FLIGHTS: FlightFare[] = [
  {
    id: "flt-1",
    airlineName: "Emirates",
    airlineLogo: "🇦🇪",
    fromCity: "New York",
    fromCode: "JFK",
    toCity: "Dubai",
    toCode: "DXB",
    tripType: "Round Trip",
    travelClass: "First Class",
    travelDate: "2026-09-15",
    farePrice: 4850,
    currency: "$",
    offerBadge: "VIP Private Suite",
    seatsAvailable: 4,
    bookingLink: "#book-flight",
    active: true,
  }
];

export const INITIAL_HOTELS: HotelItem[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [];

export const INITIAL_ENQUIRIES: EnquiryItem[] = [
  {
    id: "enq-101",
    name: "Sir Arthur Pendelton",
    email: "arthur@royalconcierge.com",
    phone: "+44 7700 900077",
    type: "Package",
    subject: "Custom 14-day European Expedition",
    message: "Requesting a private charter and 5-star chalet bookings in Zermatt.",
    date: "2026-08-04 14:20",
    status: "New",
  }
];

export const INITIAL_ABOUT: AboutSettings = {
  title: "Redefining Luxury Travel for the Modern Explorer",
  subtitle: "Crafting Unforgettable Tailor-Made Expeditions Since 2010",
  storyText: "Founded on a passion for discovery and uncompromising luxury, travelPartner curates exclusive travel journeys across 150+ countries.",
  philosophyText: "We believe travel should be effortless, inspiring, and deeply personal.",
  yearsExperience: "15+",
  vipClients: "50k+",
  satisfactionRate: "99.8%",
  conciergeSupport: "24/7",
};

export const INITIAL_CONTACT: ContactSettings = {
  email: "info@travelpartner.com",
  phone: "+1 (800) 555-TRAVEL",
  address: "123 Explorer Way, San Francisco, CA 94105",
  openingHours: "Mon - Sat: 9:00 AM - 8:00 PM EST",
  whatsappNumber: "9645185581",
  mapEmbedUrl: "https://maps.google.com",
};

export const INITIAL_WHY_CHOOSE: WhyChooseSettings = {
  sectionTitle: "Why Discerning Travelers Choose travelPartner",
  items: [
    { id: "wc-1", title: "24/7 Dedicated Butler", desc: "A personal concierge assigned to your trip from takeoff to landing." },
    { id: "wc-2", title: "Direct Tarmac Transfers", desc: "Private VIP jet handling and luxury sports car escorts." },
    { id: "wc-3", title: "Unmatched Confidentiality", desc: "Discreet expedition management for high-profile explorers." },
  ],
};

export const INITIAL_SEO: SeoSettings = {
  metaTitle: "TravelPartner | Ultra-Luxury Bespoke Travel Agency",
  metaDescription: "Experience the world's most extraordinary destinations with TravelPartner.",
  keywords: "luxury travel, first class flights, 5 star hotels, travel agency",
  ogImage: "https://travelpartner.com/images/og-luxury.jpg",
  twitterCard: "summary_large_image",
};

export const INITIAL_FOOTER: FooterSettings = {
  brandDescription: "Premium travel experiences curated for the modern explorer.",
  email: "info@travelpartner.com",
  phone: "+1 (800) 555-TRAVEL",
  address: "123 Explorer Way, San Francisco, CA 94105",
  newsletterHeading: "Get inspired. Travel smarter.",
};

export const INITIAL_MAIN_PAGE: MainPageSettings = {
  heroHeadline: "PLAN A BETTER THRILL...",
  heroSubtitle: "Curated First-Class Flights, 7-Star Resorts & Tailor-Made Expeditions.",
  heroMediaUrl: "/videos/hero.mp4",
  heroCtaText: "Explore Expeditions",
  aboutTitle: "Redefining Luxury Travel for the Modern Explorer",
  aboutSubtitle: "Crafting Unforgettable Tailor-Made Expeditions Since 2010",
  servicesTitle: "Bespoke Concierge & Travel Services",
  servicesSubtitle: "Tailored to perfection for discerning travelers worldwide.",
  destinationsTitle: "Discover Extraordinary Continents",
  destinationsSubtitle: "Explore iconic landmarks and hidden gems across 7 continents.",
  packagesTitle: "Curated Tour Packages",
  packagesSubtitle: "Handcrafted luxury itineraries with private guides and 5-star stays.",
  flightsTitle: "VIP Aviation & Special Flight Fares",
  flightsSubtitle: "Exclusive First & Business Class rates with top international carriers.",
  testimonialsTitle: "Stories From Our Discerning Guests",
  testimonialsSubtitle: "Read how we created unforgettable moments for travelers across the globe.",
  faqTitle: "Frequently Asked Questions",
  faqSubtitle: "Everything you need to know about booking and luxury concierge services.",
};

export const INITIAL_ALBUMS: AlbumItem[] = [
  {
    id: "alb-switzerland",
    name: "Switzerland Luxury Tour",
    destination: "Zermatt & Zurich",
    country: "Switzerland",
    category: "Mountains",
    coverImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Majestic Matterhorn vistas, scenic Glacier Express trains, and private alpine chalets.",
    longDesc: "Experience Switzerland at its highest pinnacle.",
    travelDate: "Dec 2025",
    featured: true,
    active: true,
    displayOrder: 1,
    images: [],
    videos: []
  }
];

export const INITIAL_MEDIA_LIBRARY: MediaLibraryItem[] = [];

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Eleanor Vance",
    role: "Luxury Travel Journalist",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
    rating: 5,
    trip: "Switzerland Expedition",
    comment: "An extraordinary experience from start to finish.",
    status: "Approved",
    createdAt: "2026-01-05"
  }
];

// ─── Reactive Store Helper Engine ─────────────────────────────────────────────
const STORE_KEY = "TRAVEL_PARTNER_STORE_V2";
// In-memory mutation timestamps (resets on page navigation — that's intentional)
const lastMutationTimestamps: Record<string, number> = {};

/** Returns stored data. Never replaces with defaults if a value was explicitly saved. */
export function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(`${STORE_KEY}_${key}`);
    if (raw === null || raw === undefined) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    return defaultValue;
  }
}

/** Returns true if admin has ever explicitly saved data for this key */
function hasAdminSavedData(key: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`HAS_DATA_${key}`) === "true";
}

/** Get the localStorage-persisted mutation timestamp for a key */
function getLastMutTime(key: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const t = localStorage.getItem(`MUT_TIME_${key}`);
    return t ? Number(t) : 0;
  } catch {
    return 0;
  }
}

/** Store the mutation timestamp in localStorage so it persists across navigation */
function setLastMutTime(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`MUT_TIME_${key}`, String(Date.now()));
  } catch {}
}

export async function syncWithSupabase<T>(key: string, value: T) {
  try {
    const res = await fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    const json = await res.json();
    if (!json.success) {
      console.warn(`Supabase sync issue for ${key}:`, json.error || json.message);
    }
  } catch (err) {
    console.warn(`Supabase sync notice for ${key}:`, err);
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  lastMutationTimestamps[key] = Date.now();
  setLastMutTime(key); // persist mutation timestamp across navigation!
  try {
    localStorage.setItem(`${STORE_KEY}_${key}`, JSON.stringify(value));
    // Mark that admin has explicitly saved data for this key
    localStorage.setItem(`HAS_DATA_${key}`, "true");
    window.dispatchEvent(new Event("travel-store-update"));
    window.dispatchEvent(new CustomEvent("travel-store-key-update", { detail: { key, value } }));
  } catch (err: any) {
    window.dispatchEvent(new Event("travel-store-update"));
    window.dispatchEvent(new CustomEvent("travel-store-key-update", { detail: { key, value } }));
  }

  // Sync to Supabase cloud database (additions, edits, and deletions)
  syncWithSupabase(key, value);
}

const activeKeyFetches = new Map<string, Promise<any>>();
const lastKeyFetchTime: Record<string, number> = {};

export async function fetchKeyFromCloud(key: string, force = false): Promise<any> {
  if (typeof window === "undefined") return null;

  const now = Date.now();
  const lastFetch = lastKeyFetchTime[key] || 0;
  // Check BOTH in-memory AND localStorage-persisted mutation time
  const lastMutMem = lastMutationTimestamps[key] || 0;
  const lastMutStorage = getLastMutTime(key);
  const lastMut = Math.max(lastMutMem, lastMutStorage);

  // Don't refetch if mutated within last 30 seconds (protects against nav-away race)
  // or fetched within last 8 seconds
  if (!force && (now - lastFetch < 8000 || now - lastMut < 30000)) {
    return getStoredData(key, null);
  }

  // Deduplicate inflight HTTP requests for the same key
  if (activeKeyFetches.has(key)) {
    return activeKeyFetches.get(key);
  }

  const promise = (async () => {
    try {
      lastKeyFetchTime[key] = Date.now();
      const res = await fetch(`/api/store?key=${key}`);
      const json = await res.json();
      if (json.success && json.data !== null && json.data !== undefined) {
        const localData = getStoredData(key, null);
        const cloudData = json.data;

        // Safety check: if cloud returned LESS items than local, and mutation was recent,
        // keep local data (Supabase sync might still be in progress)
        const cloudIsEmpty = Array.isArray(cloudData) && cloudData.length === 0;
        const localHasData = Array.isArray(localData) && (localData as any[]).length > 0;
        const mutWasRecent = now - lastMut < 60000; // within 1 minute

        if (cloudIsEmpty && localHasData && mutWasRecent) {
          // Cloud is empty but local has items and was recently mutated
          // Trust local, re-sync to cloud
          console.log(`[store] Cloud empty for ${key} but local has ${(localData as any[]).length} items. Re-syncing...`);
          syncWithSupabase(key, localData);
          return localData;
        }

        try {
          localStorage.setItem(`${STORE_KEY}_${key}`, JSON.stringify(cloudData));
          if (Array.isArray(cloudData) ? cloudData.length > 0 : cloudData !== null) {
            localStorage.setItem(`HAS_DATA_${key}`, "true");
          }
        } catch (e) {}

        window.dispatchEvent(new CustomEvent("travel-store-key-update", { detail: { key, value: cloudData } }));
        return cloudData;
      }
    } catch (err) {
      // fallback to local
    } finally {
      activeKeyFetches.delete(key);
    }
    return null;
  })();

  activeKeyFetches.set(key, promise);
  return promise;
}

/**
 * React Hook to consume reactive store data.
 *
 * Priority logic:
 * 1. If admin has saved data before (HAS_DATA flag) → always use stored/cloud (even if [])
 * 2. If never saved before → show defaults and seed Supabase on first visit
 * 3. Never overwrite recently-mutated local data with empty cloud data
 */
export function useStoreData<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [data, setData] = useState<T>(() => {
    // On first render: if admin has previously saved, use stored value (even if [])
    if (hasAdminSavedData(key)) {
      return getStoredData(key, defaultValue);
    }
    // First-ever visit: show defaults
    return defaultValue;
  });

  useEffect(() => {
    let isMounted = true;

    fetchKeyFromCloud(key).then((cloudData) => {
      if (!isMounted) return;

      if (cloudData !== null && cloudData !== undefined) {
        const isEmptyArray = Array.isArray(cloudData) && cloudData.length === 0;

        if (isEmptyArray && !hasAdminSavedData(key)) {
          // Cloud empty + admin never saved → seed defaults once
          localStorage.setItem(`HAS_DATA_${key}`, "true");
          setData(defaultValue);
          syncWithSupabase(key, defaultValue);
        } else if (!isEmptyArray) {
          // Cloud has real data → use it
          localStorage.setItem(`HAS_DATA_${key}`, "true");
          setData(cloudData);
        }
        // If cloudData is empty array but HAS_DATA is set → don't overwrite (handled in fetchKeyFromCloud)
      } else {
        // Cloud returned null/error
        if (!hasAdminSavedData(key)) {
          // First visit - seed defaults
          localStorage.setItem(`HAS_DATA_${key}`, "true");
          syncWithSupabase(key, defaultValue);
          // Keep showing defaultValue from initial state
        }
      }
    });

    const handleKeyUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === key) {
        setData(customEvent.detail.value);
      }
    };

    const handleStorageUpdate = () => {
      if (hasAdminSavedData(key)) {
        const stored = getStoredData(key, defaultValue);
        setData(stored);
      }
    };

    // Non-blocking deferred background fetch (100ms to not block initial render)
    const timer = setTimeout(() => {
      fetchKeyFromCloud(key);
    }, 100);

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("travel-store-update", handleStorageUpdate);
    window.addEventListener("travel-store-key-update", handleKeyUpdate);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("travel-store-update", handleStorageUpdate);
      window.removeEventListener("travel-store-key-update", handleKeyUpdate);
    };
  }, [key]);

  const updateData = (newValue: T) => {
    setData(newValue);
    setStoredData(key, newValue);
  };

  return [data, updateData];
}
