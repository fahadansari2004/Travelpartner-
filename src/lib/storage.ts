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
  newsletterSubtitle: string;
  copyrightText: string;
  instagram: string;
  twitter: string;
  facebook: string;
  youtube: string;
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

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  twitterCard: string;
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

// ─── Initial Mock Data ────────────────────────────────────────────────────────
export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "serv-1",
    name: "Flight Tickets",
    iconName: "Plane",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    shortDesc: "First & Business Class fares with top international airlines.",
    longDesc: "Exclusive priority ticketing, private charter bookings, and VIP airport lounge access around the globe.",
    ctaText: "Book Flights",
    displayOrder: 1,
    active: true,
  },
  {
    id: "serv-2",
    name: "Hotel Bookings",
    iconName: "Hotel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    shortDesc: "7-Star luxury resorts, private villas & underwater suites.",
    longDesc: "Hand-picked luxury accommodations featuring complimentary room upgrades, early check-ins, and butler service.",
    ctaText: "Explore Hotels",
    displayOrder: 2,
    active: true,
  },
  {
    id: "serv-3",
    name: "Holiday Packages",
    iconName: "Compass",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    shortDesc: "All-inclusive curated expeditions across 7 continents.",
    longDesc: "Custom luxury itineraries blending 5-star stays, private guides, and exclusive cultural access.",
    ctaText: "View Packages",
    displayOrder: 3,
    active: true,
  },
  {
    id: "serv-4",
    name: "Visa Assistance",
    iconName: "FileCheck",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Fast-track Schengen, US, UK, UAE & Global visa processing.",
    longDesc: "End-to-end documentation support, interview preparation, and expedited doorstep visa pick-up.",
    ctaText: "Apply Visa",
    displayOrder: 4,
    active: true,
  },
  {
    id: "serv-5",
    name: "Honeymoon Packages",
    iconName: "Heart",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Romantic island retreats in Maldives, Santorini & Bali.",
    longDesc: "Secluded overwater bungalows, candlelit beach dinners, private yacht cruises, and couples spa rituals.",
    ctaText: "Curate Romance",
    displayOrder: 5,
    active: true,
  },
  {
    id: "serv-6",
    name: "Family Tours",
    iconName: "Users",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Memorable multi-generation vacations tailored for comfort.",
    longDesc: "Child-friendly luxury itineraries, private transportation, and family suites in Disneyland, Alpine resorts, and safaris.",
    ctaText: "Plan Family Trip",
    displayOrder: 6,
    active: true,
  },
  {
    id: "serv-7",
    name: "Corporate Travel",
    iconName: "Briefcase",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Executive travel management & global business summits.",
    longDesc: "Dedicated corporate concierge, flexible flight modifications, group hotel blocks, and expense tracking.",
    ctaText: "Corporate Desk",
    displayOrder: 7,
    active: true,
  },
  {
    id: "serv-8",
    name: "Group Tours",
    iconName: "Globe",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Exclusive escorted expeditions with expert tour directors.",
    longDesc: "Small-group luxury journeys with private motor coaches, curated dining, and VIP venue access.",
    ctaText: "Join a Group",
    displayOrder: 8,
    active: true,
  },
  {
    id: "serv-9",
    name: "Cruise Packages",
    iconName: "Ship",
    image: "https://images.unsplash.com/photo-1548574505-5e2386903d8f?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Ultra-luxury ocean liner & river cruise voyages.",
    longDesc: "Balcony suites on Regent Seven Seas, Seabourn, and Viking Cruises with shore excursions included.",
    ctaText: "Sail in Luxury",
    displayOrder: 9,
    active: true,
  },
  {
    id: "serv-10",
    name: "Umrah & Pilgrimage",
    iconName: "Sparkles",
    image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80",
    shortDesc: "VIP Umrah packages with 5-star Makkah & Madinah clock tower views.",
    longDesc: "Direct Haram view suites, private VIP transport, electronic visa issuance, and guided spiritual tours.",
    ctaText: "Book VIP Umrah",
    displayOrder: 10,
    active: true,
  },
  {
    id: "serv-11",
    name: "Travel Insurance",
    iconName: "Shield",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Comprehensive global medical & trip cancellation protection.",
    longDesc: "$1M+ medical coverage, flight delay compensation, lost baggage reimbursement, and 24/7 global hotline.",
    ctaText: "Get Covered",
    displayOrder: 11,
    active: true,
  },
  {
    id: "serv-12",
    name: "Airport Transfers",
    iconName: "Car",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Chauffeur-driven Rolls Royce, Mercedes & helicopter transfers.",
    longDesc: "Tarmac meet-and-greet, luxury sedan fleet, and swift airport-to-hotel transfers.",
    ctaText: "Reserve Ride",
    displayOrder: 12,
    active: true,
  },
];

export const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: "pkg-1",
    name: "Swiss Alpine Luxury & Glacier Express",
    destination: "Switzerland",
    duration: "7 Days / 6 Nights",
    price: 4999,
    discountPrice: 4299,
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviewsCount: 128,
    featured: true,
    active: true,
    itinerary: [
      { day: 1, title: "Arrival in Zurich", desc: "VIP airport meet & chauffeur transfer to 5-star Dolder Grand." },
      { day: 2, title: "Glacier Express to Zermatt", desc: "First class panorama train ride past Matterhorn peaks." },
      { day: 3, title: "Matterhorn Glacier Paradise", desc: "Cable car summit ride & fondue dining at 3,883m." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    included: ["5-Star Luxury Hotels", "First-Class Rail Pass", "Private Airport Chauffeur", "Daily Gourmet Breakfast"],
    excluded: ["International Flights", "Personal Expenses"],
  },
  {
    id: "pkg-2",
    name: "Dubai Royal Escapes & Desert Palace",
    destination: "Dubai, UAE",
    duration: "5 Days / 4 Nights",
    price: 3499,
    discountPrice: 2999,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    rating: 5.0,
    reviewsCount: 215,
    featured: true,
    active: true,
    itinerary: [
      { day: 1, title: "Touchdown in Dubai", desc: "Private Rolls-Royce transfer to Burj Al Arab suite." },
      { day: 2, title: "Private Superyacht & Helicopter", desc: "Aerial skyline tour & sunset yacht charter along Palm Jumeirah." },
      { day: 3, title: "Royal Desert Dune Safari", desc: "Dune bashing, falconry & 7-course bedouin feast under stars." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"
    ],
    included: ["Burj Al Arab Suite", "Helicopter Flyover", "Desert Safari", "24/7 Butler Service"],
    excluded: ["Visa Fees"],
  },
  {
    id: "pkg-3",
    name: "Parisian Elegance & Loire Valley Chateau",
    destination: "Paris, France",
    duration: "6 Days / 5 Nights",
    price: 3899,
    discountPrice: 3499,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviewsCount: 94,
    featured: true,
    active: true,
    itinerary: [
      { day: 1, title: "Bienvenue à Paris", desc: "Check-in at Hotel Plaza Athénée overlooking Eiffel Tower." },
      { day: 2, title: "Private Louvre Night Tour", desc: "After-hours VIP museum tour with art historian." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
    ],
    included: ["Plaza Athénée Stay", "Private Louvre Access", "Michelin Star Dinner"],
    excluded: ["Travel Insurance"],
  },
  {
    id: "pkg-4",
    name: "Maldives Overwater Sanctuary",
    destination: "Maldives",
    duration: "6 Days / 5 Nights",
    price: 5999,
    discountPrice: 5299,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    rating: 5.0,
    reviewsCount: 164,
    featured: true,
    active: true,
    itinerary: [
      { day: 1, title: "Seaplane Flight to Atoll", desc: "Scenic seaplane transfer to Ritz-Carlton Maldives." },
      { day: 2, title: "Coral Reef & Sunset Cruise", desc: "Private dolphin cruise and underwater dining." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80"
    ],
    included: ["Overwater Pool Villa", "Roundtrip Seaplane", "All-Inclusive Dining"],
    excluded: ["Scuba Certification Fee"],
  },
];

export const INITIAL_FLIGHTS: FlightFare[] = [
  {
    id: "flt-1",
    airlineName: "Emirates",
    airlineLogo: "✈️",
    fromCity: "New York",
    fromCode: "JFK",
    toCity: "Dubai",
    toCode: "DXB",
    tripType: "Round Trip",
    travelClass: "First Class",
    travelDate: "2026-10-12",
    farePrice: 4250,
    currency: "$",
    offerBadge: "Special Fare",
    seatsAvailable: 4,
    bookingLink: "#book-flight",
    active: true,
  },
  {
    id: "flt-2",
    airlineName: "Swiss International",
    airlineLogo: "🇨🇭",
    fromCity: "London",
    fromCode: "LHR",
    toCity: "Zurich",
    toCode: "ZRH",
    tripType: "Round Trip",
    travelClass: "Business",
    travelDate: "2026-09-20",
    farePrice: 1120,
    currency: "$",
    offerBadge: "Limited Availability",
    seatsAvailable: 6,
    bookingLink: "#book-flight",
    active: true,
  },
  {
    id: "flt-3",
    airlineName: "Air France",
    airlineLogo: "🇫🇷",
    fromCity: "Los Angeles",
    fromCode: "LAX",
    toCity: "Paris",
    toCode: "CDG",
    tripType: "Round Trip",
    travelClass: "Business",
    travelDate: "2026-11-05",
    farePrice: 2890,
    currency: "$",
    offerBadge: "20% OFF",
    seatsAvailable: 3,
    bookingLink: "#book-flight",
    active: true,
  },
  {
    id: "flt-4",
    airlineName: "Qatar Airways",
    airlineLogo: "🇶🇦",
    fromCity: "Singapore",
    fromCode: "SIN",
    toCity: "Maldives",
    toCode: "MLE",
    tripType: "One Way",
    travelClass: "First Class",
    travelDate: "2026-10-01",
    farePrice: 1850,
    currency: "$",
    offerBadge: "Qsuite Special",
    seatsAvailable: 2,
    bookingLink: "#book-flight",
    active: true,
  },
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
    facilities: ["Private Pool", "Underwater Dining", "24/7 Butler", "Luxury Spa", "Seaplane Transfer"],
    description: "Iconic ocean villas with floor-to-ceiling glass doors and personal infinity pools.",
    bookingLink: "#book-hotel",
    featured: true,
    active: true,
  },
  {
    id: "htl-2",
    name: "Burj Al Arab Jumeirah",
    location: "Dubai, UAE",
    images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"],
    rating: 5.0,
    pricePerNight: 2200,
    currency: "$",
    facilities: ["Helipad", "Private Beach", "Rolls-Royce Fleet", "Infiniti Pool Terrace"],
    description: "The world's premier 7-Star hotel offering duplex suites and gold-leaf interiors.",
    bookingLink: "#book-hotel",
    featured: true,
    active: true,
  },
  {
    id: "htl-3",
    name: "The Dolder Grand",
    location: "Zurich, Switzerland",
    images: ["https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.9,
    pricePerNight: 980,
    currency: "$",
    facilities: ["4000m² Spa", "Michelin Dining", "Alpine Panorama", "Art Collection"],
    description: "Elevated luxury castle resort with panoramic views over Zurich Lake and Swiss Alps.",
    bookingLink: "#book-hotel",
    featured: true,
    active: true,
  },
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: "gal-1", title: "Swiss Alps Sunset Peak", type: "image", url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80", category: "Destinations", album: "Swiss Alps Expedition", active: true },
  { id: "gal-2", title: "Dubai Skyline & Superyacht Marina", type: "image", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80", category: "Resorts", album: "Dubai Luxury", active: true },
  { id: "gal-3", title: "Eiffel Tower Golden Hour Romance", type: "image", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80", category: "Experiences", album: "Parisian Nights", active: true },
  { id: "gal-4", title: "Maldives Overwater Bungalow & Lagoon", type: "image", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80", category: "Resorts", album: "Maldives Sanctuary", active: true },
  { id: "gal-5", title: "Aerial Mountain Glacier Helicopter Ride", type: "image", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", category: "Aerial", album: "Helicopter Tours", active: true },
  { id: "gal-6", title: "Santorini Sunset Cliff Villa", type: "image", url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80", category: "Resorts", album: "Greek Escapes", active: true },
  { id: "gal-7", title: "Kyoto Cherry Blossom Sanctuary", type: "image", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80", category: "Experiences", album: "Asian Heritage", active: true },
  { id: "gal-8", title: "Serengeti Luxury Safari Camp", type: "image", url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80", category: "Packages", album: "Wilderness Expeditions", active: true },
];

export const INITIAL_ENQUIRIES: EnquiryItem[] = [
  {
    id: "enq-101",
    name: "Sir Arthur Pendelton",
    email: "arthur@royalconcierge.com",
    phone: "+44 7700 900077",
    type: "Package",
    subject: "Custom 14-day European Helicopter & Chalet Expedition",
    message: "Requesting a private charter and 5-star chalet bookings in Zermatt and St. Moritz for 4 guests.",
    date: "2026-08-04 14:20",
    status: "New",
  },
  {
    id: "enq-102",
    name: "Elena Rostova",
    email: "elena@vipatlantis.com",
    phone: "+1 305 555 0199",
    type: "Flight",
    subject: "Emirates First Class Suite for October",
    message: "Checking seat availability for JFK to DXB round-trip in First Class for 2 passengers.",
    date: "2026-08-04 11:45",
    status: "Read",
  },
];

export const INITIAL_ABOUT: AboutSettings = {
  title: "Redefining Luxury Travel for the Modern Explorer",
  subtitle: "Crafting Unforgettable Tailor-Made Expeditions Since 2010",
  storyText: "Founded on a passion for discovery and uncompromising luxury, travelPartner curates exclusive travel journeys across 150+ countries. From private island retreats to alpine chalets, our dedicated concierge team handles every detail.",
  philosophyText: "We believe travel should be effortless, inspiring, and deeply personal. Every itinerary is meticulously customized to elevate your journey into an extraordinary memory.",
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
  metaDescription: "Experience the world's most extraordinary destinations with TravelPartner. First-class flights, 7-star hotels, bespoke tours & VIP concierge.",
  keywords: "luxury travel, first class flights, 5 star hotels, travel agency, bespoke holiday packages",
  ogImage: "https://travelpartner.com/images/og-luxury.jpg",
  twitterCard: "summary_large_image",
};

export const INITIAL_FOOTER: FooterSettings = {
  brandDescription: "Premium travel experiences curated for the modern explorer. Breathtaking destinations, seamless booking, unforgettable memories.",
  email: "info@travelpartner.com",
  phone: "+1 (800) 555-TRAVEL",
  address: "123 Explorer Way, San Francisco, CA 94105",
  newsletterHeading: "Get inspired. Travel smarter.",
  newsletterSubtitle: "Weekly destination picks, travel tips & exclusive deals — straight to your inbox.",
  copyrightText: "© 2026 travelPartner Tours & Travel Inc. All rights reserved.",
  instagram: "https://instagram.com/travelpartner",
  twitter: "https://twitter.com/travelpartner",
  facebook: "https://facebook.com/travelpartner",
  youtube: "https://youtube.com/travelpartner",
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
    shortDesc: "Majestic Matterhorn vistas, scenic Glacier Express trains, and private alpine chalets in St. Moritz.",
    longDesc: "Experience Switzerland at its highest pinnacle. Private helicopter tours around the Matterhorn peak, fondue dinners on glacier summits, and stays at 5-star grand hotels overlooking Lake Geneva.",
    travelDate: "Dec 2025",
    featured: true,
    active: true,
    displayOrder: 1,
    seoTitle: "Switzerland Luxury Alpine Tour & Photo Album",
    seoDescription: "Photos and videos from our luxury Swiss Alps and Zermatt expeditions.",
    relatedPackageId: "pkg-1",
    images: [
      { id: "sw-1", title: "Matterhorn Sunrise", type: "image", url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80", caption: "Dawn glow over the Matterhorn in Zermatt.", displayOrder: 1 },
      { id: "sw-2", title: "Glacier Express", type: "image", url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80", caption: "Panorama train crossing Landwasser Viaduct.", displayOrder: 2 },
      { id: "sw-3", title: "Zurich Lake Promenade", type: "image", url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80", caption: "Golden hour near Lake Zurich waterfront.", displayOrder: 3 },
      { id: "sw-4", title: "Alpine Chalet Lounge", type: "image", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", caption: "Cozy fire pit inside our luxury mountain retreat.", displayOrder: 4 }
    ],
    videos: [
      { id: "sw-v1", title: "Matterhorn Helicopter Flight", type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-flying-over-snow-covered-mountains-41551-large.mp4", caption: "Cinematic 4K aerial footage over Zermatt peaks.", displayOrder: 1 }
    ]
  },
  {
    id: "alb-dubai",
    name: "Dubai Premium Experience",
    destination: "Dubai Marina & Desert",
    country: "United Arab Emirates",
    category: "Luxury",
    coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Burj Al Arab suite access, VIP desert safari dune bashing, and sunset superyacht cruises in Marina.",
    longDesc: "Ultra-luxurious Arabian nights. Private helipad arrival at Burj Al Arab, gourmet dining under desert stars, supercar rally across Dubai highways, and charter yachts with private DJ.",
    travelDate: "Nov 2025",
    featured: true,
    active: true,
    displayOrder: 2,
    seoTitle: "Dubai Premium Luxury Experience Album",
    seoDescription: "Explore luxury yachting and private desert expeditions in Dubai.",
    relatedPackageId: "pkg-3",
    images: [
      { id: "db-1", title: "Dubai Skyline & Marina", type: "image", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80", caption: "Breathtaking dusk view of Marina skyscrapers.", displayOrder: 1 },
      { id: "db-2", title: "VIP Desert Dune Safari", type: "image", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", caption: "Sunset dune bashing in Royal Reserve sand dunes.", displayOrder: 2 },
      { id: "db-3", title: "Burj Al Arab Terrace Pool", type: "image", url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80", caption: "Infinity pool cabana overlooking the Persian Gulf.", displayOrder: 3 }
    ],
    videos: [
      { id: "db-v1", title: "Dubai Marina Yacht Cruise", type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-speed-boat-sailing-in-the-sea-41549-large.mp4", caption: "Private yacht voyage at sunset.", displayOrder: 1 }
    ]
  },
  {
    id: "alb-maldives",
    name: "Maldives Honeymoon",
    destination: "Baa Atoll",
    country: "Maldives",
    category: "Honeymoon",
    coverImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Overwater pool villas, private sandbank candlelit dinners, and swimming with manta rays.",
    longDesc: "Pure tropical bliss in the Indian Ocean. Glass-bottom floor villas, private butler service, underwater restaurant wine tasting, and couples spa rituals above turquoise lagoon waters.",
    travelDate: "Jan 2026",
    featured: true,
    active: true,
    displayOrder: 3,
    seoTitle: "Maldives Honeymoon Luxury Photo Album",
    seoDescription: "Overwater villa album and coral reef diving in Baa Atoll Maldives.",
    relatedPackageId: "pkg-2",
    images: [
      { id: "mv-1", title: "Overwater Villa Pier", type: "image", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80", caption: "Secluded wooden boardwalk leading to overwater suites.", displayOrder: 1 },
      { id: "mv-2", title: "Lagoon Infinity Pool", type: "image", url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80", caption: "Private deck pool with direct ocean access.", displayOrder: 2 },
      { id: "mv-3", title: "Private Sandbank Sunset", type: "image", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", caption: "Candlelit dinner setup on isolated coral sandbank.", displayOrder: 3 }
    ],
    videos: [
      { id: "mv-v1", title: "Maldives Lagoon Aerial View", type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-with-turquoise-water-41548-large.mp4", caption: "Seaplane descent over Baa Atoll reefs.", displayOrder: 1 }
    ]
  },
  {
    id: "alb-kashmir",
    name: "Kashmir Winter Escape",
    destination: "Gulmarg & Srinagar",
    country: "India",
    category: "Mountains",
    coverImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Gulmarg Gondola skiing, heritage Dal Lake houseboats, and snow-capped Himalayan peaks.",
    longDesc: "Paradise on Earth transformed into a winter wonderland. Ride Asia's highest gondola to Apharwat peak, sip warm Kahwa tea inside wooden houseboats, and glide across snow slopes.",
    travelDate: "Jan 2026",
    featured: false,
    active: true,
    displayOrder: 4,
    images: [
      { id: "ks-1", title: "Gulmarg Snow Slopes", type: "image", url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80", caption: "Powder snow skiing slopes of Gulmarg.", displayOrder: 1 },
      { id: "ks-2", title: "Shikara Ride Dal Lake", type: "image", url: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80", caption: "Traditional decorated Shikara boat at dusk.", displayOrder: 2 }
    ],
    videos: []
  },
  {
    id: "alb-bali",
    name: "Bali Paradise Retreat",
    destination: "Ubud & Seminyak",
    country: "Indonesia",
    category: "Experiences",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Lush Tegallalang rice terraces, jungle infinity pools, and sacred cliffside temples in Uluwatu.",
    longDesc: "Immerse in Balinese spirituality and beach luxury. Private jungle villas in Ubud, cliffside Kecak dance performances at Uluwatu, and sunset cocktail lounges in Seminyak.",
    travelDate: "Oct 2025",
    featured: false,
    active: true,
    displayOrder: 5,
    images: [
      { id: "bl-1", title: "Ubud Rice Terraces", type: "image", url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80", caption: "Emerald green stepped rice terraces in Ubud.", displayOrder: 1 }
    ],
    videos: []
  },
  {
    id: "alb-munnar",
    name: "Munnar Weekend Trip",
    destination: "Munnar & Western Ghats",
    country: "India",
    category: "Destinations",
    coverImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Rolling tea gardens, misty hilltops, tea tasting estates, and wildlife spotting in Eravikulam.",
    longDesc: "Escape to green serenity in God's Own Country. Stay in heritage tea bungalow suites, trek to Anamudi peak, and enjoy cool mountain breezes.",
    travelDate: "Sep 2025",
    featured: false,
    active: true,
    displayOrder: 6,
    images: [
      { id: "mn-1", title: "Munnar Tea Plantations", type: "image", url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80", caption: "Endless rolling green tea carpet in Munnar.", displayOrder: 1 }
    ],
    videos: []
  },
  {
    id: "alb-goa",
    name: "Goa Beach Vacation",
    destination: "South Goa & Mandovi",
    country: "India",
    category: "Beaches",
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Pristine white sand beaches, luxury resort shacks, Mandovi river cruises, and heritage Latin quarters.",
    longDesc: "Unwind on South Goa's quiet palmfringed shores. Private beach barbecues, luxury Catamaran sailing, Portuguese villa architecture tours, and fine dining.",
    travelDate: "Aug 2025",
    featured: false,
    active: true,
    displayOrder: 7,
    images: [
      { id: "goa-1", title: "Palolem Sunset Beach", type: "image", url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80", caption: "Golden hour sunset over palm-fringed Goa coast.", displayOrder: 1 }
    ],
    videos: []
  }
];

export const INITIAL_MEDIA_LIBRARY: MediaLibraryItem[] = [
  { id: "med-1", name: "Switzerland Matterhorn Peak", url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80", type: "image", category: "Gallery", uploadDate: "2026-01-10" },
  { id: "med-2", name: "Dubai Marina Dusk", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80", type: "image", category: "Gallery", uploadDate: "2026-01-12" },
  { id: "med-3", name: "Maldives Overwater Villa", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80", type: "image", category: "Hotel", uploadDate: "2026-01-15" },
  { id: "med-4", name: "First Class Cabin Interior", url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80", type: "image", category: "Hero", uploadDate: "2026-01-18" },
  { id: "med-5", name: "Kashmir Gulmarg Snow", url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80", type: "image", category: "Package", uploadDate: "2026-01-20" }
];

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Eleanor Vance",
    role: "Luxury Travel Journalist",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
    rating: 5,
    trip: "Switzerland & Kyoto Expedition",
    comment: "An extraordinary experience from start to finish. The custom itinerary gave us total flexibility, and the private helicopter flight in Zermatt was unforgettable.",
    status: "Approved",
    createdAt: "2026-01-05"
  },
  {
    id: "t2",
    name: "Dr. Jonathan Sterling",
    role: "Venture Architect",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    rating: 5,
    trip: "Dubai Superyacht Odyssey",
    comment: "Flawless white-glove concierge service. Our private yacht in Dubai Marina was spectacular, and the desert camp dinner felt truly exclusive.",
    status: "Approved",
    createdAt: "2026-01-12"
  },
  {
    id: "t3",
    name: "Sophia & Liam Chen",
    role: "Honeymooners",
    location: "Singapore",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80",
    rating: 5,
    trip: "Maldives Overwater Lagoon Suite",
    comment: "We booked our dream honeymoon in under 3 minutes. The overwater villa pool view over the lagoon was surreal!",
    status: "Approved",
    createdAt: "2026-01-18"
  }
];

// ─── Reactive Local Storage Helper Hook ───────────────────────────────────────
const STORE_KEY = "TRAVEL_PARTNER_STORE_V2";

export function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(`${STORE_KEY}_${key}`);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(defaultValue) && defaultValue.length > 0) {
      return defaultValue;
    }
    return parsed;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

/**
 * Automatically prune old oversized base64 images from localStorage when browser quota is exceeded
 */
function pruneOversizedStorage() {
  if (typeof window === "undefined") return;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORE_KEY)) {
        const value = localStorage.getItem(key);
        if (value && value.length > 300000) {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              const pruned = parsed.map((item: any) => {
                let updated = { ...item };
                if (updated.coverImage && updated.coverImage.startsWith("data:image") && updated.coverImage.length > 150000) {
                  updated.coverImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
                }
                if (updated.url && updated.url.startsWith("data:image") && updated.url.length > 150000) {
                  updated.url = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
                }
                return updated;
              });
              localStorage.setItem(key, JSON.stringify(pruned));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
  } catch (err) {
    console.error("Auto-prune storage failed:", err);
  }
}

import { supabase, isSupabaseConfigured } from "./supabase";

export async function syncWithSupabase<T>(key: string, value: T) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const tableMap: Record<string, string> = {
      albums: "albums",
      testimonials: "testimonials",
      enquiries: "enquiries",
      packages: "packages",
      mediaLibrary: "media_library",
    };
    const tableName = tableMap[key];
    if (tableName && Array.isArray(value)) {
      if (value.length > 0) {
        // 1. Upsert current active items to Supabase
        const safeRecords = value.map((item: any) => {
          const clean: any = { ...item };
          if (clean.coverImage && !clean.cover_image) clean.cover_image = clean.coverImage;
          if (clean.shortDesc && !clean.short_desc) clean.short_desc = clean.shortDesc;
          if (clean.longDesc && !clean.long_desc) clean.long_desc = clean.longDesc;
          if (clean.travelDate && !clean.travel_date) clean.travel_date = clean.travelDate;
          if (clean.discountPrice && !clean.discount_price) clean.discount_price = clean.discountPrice;
          if (clean.uploadDate && !clean.upload_date) clean.upload_date = clean.uploadDate;
          return clean;
        });
        await supabase.from(tableName).upsert(safeRecords);

        // 2. Reconcile and permanently delete removed items from Supabase Cloud DB
        const { data: dbRows } = await supabase.from(tableName).select("id");
        if (dbRows && dbRows.length > 0) {
          const currentIds = new Set(value.map((v: any) => v.id));
          const deletedIds = dbRows.filter((r: any) => !currentIds.has(r.id)).map((r: any) => r.id);
          if (deletedIds.length > 0) {
            await supabase.from(tableName).delete().in("id", deletedIds);
          }
        }
      } else {
        // If array is emptied, delete all rows from Supabase table
        await supabase.from(tableName).delete().neq("id", "00000000-0000-0000-0000-000000000000");
      }
    }
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
    if (err?.name === "QuotaExceededError" || err?.code === 22 || err?.number === -2147024882) {
      pruneOversizedStorage();
      try {
        localStorage.setItem(`${STORE_KEY}_${key}`, JSON.stringify(value));
      } catch (retryErr) {
        console.warn(`Storage item for ${key} held in active runtime memory.`, retryErr);
      }
    }
    window.dispatchEvent(new Event("travel-store-update"));
    window.dispatchEvent(new CustomEvent("travel-store-key-update", { detail: { key, value } }));
  }

  // Sync automatically with Supabase cloud database if configured
  if (isSupabaseConfigured) {
    syncWithSupabase(key, value);
  }
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

    const fetchFromSupabase = () => {
      if (isSupabaseConfigured && supabase) {
        const tableMap: Record<string, string> = {
          albums: "albums",
          testimonials: "testimonials",
          enquiries: "enquiries",
          packages: "packages",
          mediaLibrary: "media_library",
        };
        const tableName = tableMap[key];
        if (tableName) {
          supabase.from(tableName).select("*").then(({ data: cloudRecords, error }) => {
            if (!error && cloudRecords) {
              if (cloudRecords.length > 0) {
                setData(cloudRecords as any);
                try {
                  localStorage.setItem(`${STORE_KEY}_${key}`, JSON.stringify(cloudRecords));
                } catch (e) {
                  // ignore
                }
              } else if (Array.isArray(defaultValue) && defaultValue.length > 0) {
                // Seed Supabase with default initial records if cloud table is empty
                syncWithSupabase(key, defaultValue);
              }
            }
          });
        }
      }
    };

    // Initial fetch from Supabase
    fetchFromSupabase();

    // 4-second auto-poll interval for real-time multi-device cloud updates
    let pollInterval: NodeJS.Timeout | null = null;
    if (isSupabaseConfigured) {
      pollInterval = setInterval(fetchFromSupabase, 4000);
    }

    window.addEventListener("travel-store-update", handleUpdate);
    window.addEventListener("travel-store-key-update", handleKeyUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener("travel-store-update", handleUpdate);
      window.removeEventListener("travel-store-key-update", handleKeyUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [key, defaultValue]);

  const updateStore = (newValue: T) => {
    setData(newValue);
    setStoredData(key, newValue);
  };

  return [data, updateStore];
}
