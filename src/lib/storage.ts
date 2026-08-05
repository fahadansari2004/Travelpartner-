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

export const INITIAL_HOTELS: HotelItem[] = [
  {
    id: "htl-1",
    name: "The Ritz-Carlton Maldives, Fari Islands",
    location: "Maldives Atoll",
    images: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80"],
    rating: 5.0,
    pricePerNight: 1650,
    currency: "$",
    facilities: ["Private Pool", "Underwater Dining", "24/7 Butler", "Luxury Spa"],
    description: "Iconic ocean villas with floor-to-ceiling glass doors and personal infinity pools.",
    bookingLink: "#book-hotel",
    featured: true,
    active: true,
  }
];

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
  whatsappNumber: "+1 (800) 555-8728",
  mapEmbedUrl: "https://maps.google.com",
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

export function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(`${STORE_KEY}_${key}`);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    return defaultValue;
  }
}

export async function syncWithSupabase<T>(key: string, value: T) {
  try {
    await fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  } catch (err) {
    console.warn(`Supabase sync notice for ${key}:`, err);
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORE_KEY}_${key}`, JSON.stringify(value));
    window.dispatchEvent(new Event("travel-store-update"));
    window.dispatchEvent(new CustomEvent("travel-store-key-update", { detail: { key, value } }));
  } catch (err: any) {
    window.dispatchEvent(new Event("travel-store-update"));
    window.dispatchEvent(new CustomEvent("travel-store-key-update", { detail: { key, value } }));
  }

  // Sync automatically with Supabase cloud database
  syncWithSupabase(key, value);
}

/**
 * Custom React Hook to consume reactive store data with real-time cloud sync
 */
export function useStoreData<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [data, setData] = useState<T>(() => getStoredData(key, defaultValue));

  useEffect(() => {
    const handleUpdate = () => {
      const stored = getStoredData(key, defaultValue);
      setData(stored);
    };

    const handleKeyUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === key) {
        setData(customEvent.detail.value);
      }
    };

    const fetchFromSupabase = async () => {
      try {
        const res = await fetch(`/api/store?key=${key}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setData((prevData: any) => {
            if (!Array.isArray(prevData) || prevData.length === 0) {
              try {
                localStorage.setItem(`${STORE_KEY}_${key}`, JSON.stringify(json.data));
              } catch (e) {}
              return json.data as any;
            }
            
            // Merge: preserve local status updates and combine cloud items
            const cloudMap = new Map((json.data as any[]).map((item: any) => [item.id, item]));
            const prevMap = new Map(prevData.map((item: any) => [item.id, item]));
            const mergedMap = new Map();

            for (const [id, cloudItem] of cloudMap.entries()) {
              const prevItem = prevMap.get(id);
              if (cloudItem.status === "Approved" || cloudItem.status === "Rejected") {
                mergedMap.set(id, cloudItem);
              } else if (prevItem && prevItem.status && prevItem.status === "Approved") {
                mergedMap.set(id, { ...cloudItem, status: "Approved" });
              } else {
                mergedMap.set(id, cloudItem);
              }
            }

            for (const [id, prevItem] of prevMap.entries()) {
              if (!mergedMap.has(id)) {
                mergedMap.set(id, prevItem);
              }
            }

            const mergedList = Array.from(mergedMap.values());
            try {
              localStorage.setItem(`${STORE_KEY}_${key}`, JSON.stringify(mergedList));
            } catch (e) {}
            return mergedList as any;
          });
          return;
        }
      } catch (err) {
        // fallback
      }
    };

    fetchFromSupabase();
    const intervalId = setInterval(fetchFromSupabase, 4000);

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("travel-store-update", handleUpdate);
    window.addEventListener("travel-store-key-update", handleKeyUpdate);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("travel-store-update", handleUpdate);
      window.removeEventListener("travel-store-key-update", handleKeyUpdate);
    };
  }, [key, defaultValue]);

  const updateData = (newValue: T) => {
    setData(newValue);
    setStoredData(key, newValue);
  };

  return [data, updateData];
}
