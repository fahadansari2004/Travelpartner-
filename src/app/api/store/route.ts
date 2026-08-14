import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_SUPABASE_URL = "https://ciixxtmneichewgjujbe.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_IzWYI8X4GgnLXIg__LNJIg_tSA0ZaE5";

let rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

if (rawUrl.endsWith("/")) rawUrl = rawUrl.slice(0, -1);
if (rawUrl.endsWith("/rest/v1")) rawUrl = rawUrl.slice(0, -8);
if (rawUrl.endsWith("/")) rawUrl = rawUrl.slice(0, -1);

const supabaseKey = supabaseServiceKey || supabaseAnonKey;
const supabase = createClient(rawUrl, supabaseKey);

const tableMap: Record<string, string> = {
  albums: "albums",
  testimonials: "testimonials",
  enquiries: "enquiries",
  packages: "packages",
  mediaLibrary: "media_library",
  flights: "flights",
  hotels: "hotels",
  services: "services",
  mainPage: "services",
  footer: "services",
  about: "services",
  contact: "services",
  seo: "services",
  whyChoose: "services",
};

const apiCache: Record<string, { timestamp: number; data: any }> = {};
const CACHE_TTL_MS = 1000;

const settingsKeys = ["mainPage", "footer", "about", "contact", "seo", "whyChoose"];

/** Safely parse JSON that may or may not be a string */
function safeParseJson(val: any, fallback: any = null) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/** Filter out base64 data URLs — only keep real URLs */
function filterUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("data:")) return ""; // strip base64
  return url;
}

/** Filter an array, removing base64 or empty URLs */
function filterUrlArray(arr: any[]): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) => (typeof item === "string" ? filterUrl(item) : ""))
    .filter(Boolean);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key || !supabase) return NextResponse.json({ success: false, error: "No Supabase client configured", data: [] });

    const tableName = tableMap[key];
    if (!tableName) return NextResponse.json({ success: false, error: "Invalid key", data: [] });

    // Check fast in-memory cache
    const cached = apiCache[key];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(
        { success: true, data: cached.data },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
      );
    }

    // Handle System Settings keys stored in services table
    if (settingsKeys.includes(key)) {
      const { data: settingRow } = await supabase.from("services").select("*").eq("id", `setting_${key}`).maybeSingle();
      if (settingRow && settingRow.short_desc) {
        try {
          const parsed = JSON.parse(settingRow.short_desc);
          if (key === "contact" && parsed && typeof parsed === "object") {
            if (!parsed.whatsappNumber || parsed.whatsappNumber === "7356044637") {
              parsed.whatsappNumber = "9645185581";
            }
            if (!parsed.phone || parsed.phone.includes("7356044637")) {
              parsed.phone = "+91 9645185581";
            }
          }
          apiCache[key] = { timestamp: Date.now(), data: parsed };
          return NextResponse.json({ success: true, data: parsed }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } });
        } catch (e) {}
      }
      return NextResponse.json({ success: true, data: null });
    }

    const { data, error } = await supabase.from(tableName).select("*");
    if (error) return NextResponse.json({ success: false, error: error.message, data: [] });

    // Explicit mapping & auto-seeding for services table
    if (tableName === "services") {
      let servicesList = (data || [])
        .filter((item: any) => !item.id?.startsWith("setting_"))
        .map((item: any) => ({
          id: String(item.id),
          name: item.name || item.title || "Travel Service",
          category: item.category || "Concierge",
          iconName: item.icon_name || item.iconName || "Compass",
          image: item.image || "",
          shortDesc: item.short_desc || item.shortDesc || item.description || "Travel service.",
          longDesc: item.long_desc || item.longDesc || item.short_desc || "",
          ctaText: item.cta_text || item.ctaText || "Learn More",
          displayOrder: Number(item.display_order ?? item.displayOrder ?? 1),
          active: item.active !== undefined ? Boolean(item.active) : true,
        }));

      // If database has fewer than 10 services, seed all 10 custom services into Supabase!
      if (servicesList.length < 10) {
        const DEFAULT_10_SERVICES = [
          { id: "srv-1", name: "Visit Visa", category: "Visa & Travel Documents", icon_name: "FileText", image: "", short_desc: "Fast-track tourist & business visit visa processing for major destinations worldwide.", long_desc: "Expert guidance for tourist and business visas with step-by-step document check, appointment scheduling, and high approval rate.", cta_text: "Apply Visa", display_order: 1, active: true },
          { id: "srv-2", name: "Visa Stamping", category: "Visa & Travel Documents", icon_name: "FileCheck", image: "", short_desc: "Complete consulate & embassy visa stamping services with verified document submission.", long_desc: "Hassle-free visa endorsement and embassy stamping for employment, residence, and family visas.", cta_text: "Get Stamped", display_order: 2, active: true },
          { id: "srv-3", name: "Flight Tickets", category: "Flight & Travel", icon_name: "Plane", image: "", short_desc: "Exclusive domestic & international flight ticket bookings at best rate guarantee.", long_desc: "Instant ticket issuance across global airlines, seat selection, extra baggage assistance, and 24/7 rebooking support.", cta_text: "Book Flights", display_order: 3, active: true },
          { id: "srv-4", name: "Hotel Booking", category: "Accommodations", icon_name: "Building", image: "", short_desc: "Premium hotel reservations, luxury resorts, and boutique stay accommodations worldwide.", long_desc: "Curated 3-star to 5-star hotel stays with free breakfast options, early check-in perks, and flexible cancellation policies.", cta_text: "Book Hotel", display_order: 4, active: true },
          { id: "srv-5", name: "Train Tickets", category: "Transportation", icon_name: "Train", image: "", short_desc: "Seamless IRCTC & international rail ticket reservations with instant confirmation.", long_desc: "Confirmed train seat reservations, sleeper, AC 3-tier, 2-tier, and executive class bookings with express assistance.", cta_text: "Book Train", display_order: 5, active: true },
          { id: "srv-6", name: "Holiday Packages", category: "Tours & Holidays", icon_name: "Luggage", image: "", short_desc: "Customized domestic & international holiday tour packages crafted for your budget.", long_desc: "All-inclusive tour packages including flights, luxury stays, guided sightseeing, transfers, and custom travel itineraries.", cta_text: "View Packages", display_order: 6, active: true },
          { id: "srv-7", name: "Emigration Clearance Service", category: "Government Services", icon_name: "ShieldCheck", image: "", short_desc: "Hassle-free ECR/ECNR emigration clearance assistance for overseas employment & travel.", long_desc: "Official Ministry of External Affairs emigration clearance processing for workers and travellers travelling abroad.", cta_text: "Get Clearance", display_order: 7, active: true },
          { id: "srv-8", name: "Certificate Attestation", category: "Government Services", icon_name: "Award", image: "", short_desc: "HRD, MEA, Apostille & Embassy certificate attestation for educational and commercial documents.", long_desc: "Verified degree, birth, marriage, and commercial certificate attestation from state departments, MEA, and foreign embassies.", cta_text: "Attest Certificate", display_order: 8, active: true },
          { id: "srv-9", name: "Passport Application", category: "Government Services", icon_name: "BookOpen", image: "", short_desc: "Fresh passport applications, renewal, address change, and tatkal appointment assistance.", long_desc: "End-to-end Passport Seva Kendra application filing, document verification, appointment booking, and tatkal support.", cta_text: "Apply Passport", display_order: 9, active: true },
          { id: "srv-10", name: "Pancard Service", category: "Government Services", icon_name: "CreditCard", image: "", short_desc: "New PAN card application, correction, and instant e-PAN card processing services.", long_desc: "Fast PAN card processing for resident & NRI applicants, name/address corrections, and physical card delivery.", cta_text: "Apply PAN", display_order: 10, active: true },
        ];
        await supabase.from("services").upsert(DEFAULT_10_SERVICES, { onConflict: "id" });
        const { data: freshRows } = await supabase.from("services").select("*");
        if (freshRows && freshRows.length > 0) {
          servicesList = freshRows
            .filter((item: any) => !item.id?.startsWith("setting_"))
            .map((item: any) => ({
              id: String(item.id),
              name: item.name || item.title || "Travel Service",
              category: item.category || "Concierge",
              iconName: item.icon_name || item.iconName || "Compass",
              image: item.image || "",
              shortDesc: item.short_desc || item.shortDesc || item.description || "Travel service.",
              longDesc: item.long_desc || item.longDesc || item.short_desc || "",
              ctaText: item.cta_text || item.ctaText || "Learn More",
              displayOrder: Number(item.display_order ?? item.displayOrder ?? 1),
              active: item.active !== undefined ? Boolean(item.active) : true,
            }));
        }
      }

      apiCache[key] = { timestamp: Date.now(), data: servicesList };
      return NextResponse.json(
        { success: true, data: servicesList },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
      );
    }

    // Map PostgreSQL columns to React camelCase properties
    const mappedData = (data || [])
      .filter((item: any) => !item.id?.startsWith("setting_"))
      .map((item: any) => {
        if (tableName === "albums") {
          const rawImages = safeParseJson(item.images, []);
          const imagesArr = Array.isArray(rawImages) ? rawImages : [];
          const rawVideos = safeParseJson(item.videos, []);
          const videosArr = Array.isArray(rawVideos) ? rawVideos : [];
          return {
            id: String(item.id),
            name: item.name || "Luxury Album",
            destination: item.destination || item.location || "Destination",
            country: item.country || "Global",
            category: item.category || "Destinations",
            coverImage: filterUrl(item.cover_image || item.coverImage || item.image) || "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
            shortDesc: item.short_desc || item.shortDesc || "Luxury travel photo album.",
            longDesc: item.long_desc || item.longDesc || "",
            travelDate: item.travel_date || item.travelDate || "2026",
            featured: Boolean(item.featured),
            active: item.active !== undefined ? Boolean(item.active) : true,
            displayOrder: Number(item.display_order ?? item.displayOrder ?? 1),
            images: imagesArr,
            videos: videosArr,
          };
        }

        if (tableName === "packages") {
          let rawDesc = item.description || "";
          let cleanTextStr = item.short_desc || "";
          let inc: string[] = Array.isArray(item.included) ? item.included : [];
          let exc: string[] = Array.isArray(item.excluded) ? item.excluded : [];
          let itin: any[] = Array.isArray(item.itinerary) ? item.itinerary : [];

          if (typeof rawDesc === "string" && rawDesc.trim().startsWith("{") && rawDesc.trim().endsWith("}")) {
            try {
              const parsed = JSON.parse(rawDesc);
              if (!cleanTextStr) cleanTextStr = parsed.text || parsed.description || "";
              if (inc.length === 0 && Array.isArray(parsed.included)) inc = parsed.included;
              if (exc.length === 0 && Array.isArray(parsed.excluded)) exc = parsed.excluded;
              if (itin.length === 0 && Array.isArray(parsed.itinerary)) itin = parsed.itinerary;
            } catch (e) {}
          } else if (rawDesc && !cleanTextStr) {
            cleanTextStr = rawDesc;
          }

          if (!cleanTextStr || cleanTextStr.trim().startsWith("{")) {
            cleanTextStr = "Bespoke luxury tour package.";
          }

          const galleryUrls = Array.isArray(item.gallery) ? item.gallery : [];

          return {
            id: String(item.id),
            name: item.name || "Luxury Tour Package",
            destination: item.destination || "Global Destination",
            duration: item.duration || "5 Days / 4 Nights",
            price: Number(item.price || 1999),
            discountPrice: Number(item.discount_price ?? item.price ?? 1999),
            image: item.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
            rating: Number(item.rating || 4.9),
            reviewsCount: Number(item.reviews_count ?? 15),
            featured: Boolean(item.featured),
            active: item.active !== undefined ? Boolean(item.active) : true,
            shortDesc: cleanTextStr,
            description: cleanTextStr,
            itinerary: itin,
            gallery: galleryUrls,
            included: inc,
            excluded: exc,
            mapLocation: item.map_location,
            videoUrl: item.video_url,
            createdAt: item.created_at || new Date().toISOString(),
          };
        }

        // Generic fallback for other tables
        let rawDesc = item.description || "";
        let cleanDesc = item.short_desc || item.shortDesc || "";

        if (typeof rawDesc === "string" && rawDesc.trim().startsWith("{") && rawDesc.trim().endsWith("}")) {
          try {
            const parsed = JSON.parse(rawDesc);
            cleanDesc = parsed.text || parsed.description || cleanDesc;
          } catch (e) {}
        } else if (rawDesc) {
          cleanDesc = rawDesc;
        }

        let serviceDesc = item.short_desc || item.long_desc || item.shortDesc || item.longDesc || cleanDesc || "";
        const gallery = safeParseJson(item.gallery, []);
        let imagesArr = safeParseJson(item.images, []);
        if (!Array.isArray(imagesArr)) imagesArr = [];
        let videosArr = safeParseJson(item.videos, []);
        if (!Array.isArray(videosArr)) videosArr = [];

        return {
          ...item,
          id: String(item.id),
          name: item.name || item.customer_name || item.customerName || "Valued Client",
          customerName: item.name || item.customer_name || item.customerName || "Valued Client",
          packageOrItemName: item.subject || item.package_name || item.packageOrItemName || "Travel Booking",
          packageName: item.subject || item.package_name || item.packageName || "Travel Booking",
          subject: item.subject || item.package_name || item.packageOrItemName || "Travel Booking",
          message: item.message || item.notes || "",
          notes: item.message || item.notes || "",
          guestsCount: item.guests_count || item.guests || 1,
          guests: item.guests_count || item.guests || 1,
          travelDate: item.travel_date || item.travelDate || "",
          preferredTime: item.preferred_time || item.preferredTime || "",
          totalAmount: item.total_amount || item.totalAmount || 0,
          createdAt: item.created_at || item.createdAt || item.date || new Date().toISOString().slice(0, 10),
          date: item.created_at || item.createdAt || item.date || new Date().toISOString().slice(0, 10),
          coverImage: item.cover_image || item.coverImage || item.image || "",
          shortDesc: cleanDesc,
          description: cleanDesc,
          longDesc: item.long_desc || item.longDesc || serviceDesc,
          gallery: Array.isArray(gallery) ? gallery : [],
          images: imagesArr,
          videos: videosArr,
          discountPrice: item.discount_price ?? item.discountPrice ?? item.price,
          uploadDate: item.upload_date || item.uploadDate || item.created_at,
          reviewsCount: item.reviews_count ?? item.reviewsCount ?? 10,
          mapLocation: item.map_location || item.mapLocation,
          videoUrl: item.video_url || item.videoUrl,
          airlineName: item.airline_name || item.airlineName,
          airlineLogo: item.airline_logo || item.airlineLogo,
          fromCity: item.from_city || item.fromCity,
          fromCode: item.from_code || item.fromCode,
          toCity: item.to_city || item.toCity,
          toCode: item.to_code || item.toCode,
          tripType: item.trip_type || item.tripType,
          travelClass: item.travel_class || item.travelClass,
          farePrice: Number(item.fare_price ?? item.farePrice ?? 0),
          offerBadge: item.offer_badge || item.offerBadge,
          seatsAvailable: item.seats_available ?? item.seatsAvailable,
          bookingLink: item.booking_link || item.bookingLink,
          pricePerNight: item.price_per_night ?? item.pricePerNight,
          iconName: item.icon_name || item.iconName,
          ctaText: item.cta_text || item.ctaText,
          displayOrder: item.display_order ?? item.displayOrder ?? 1,
        };
      });

    return NextResponse.json(
      { success: true, data: mappedData },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { key, value } = await req.json();
    if (!key || !value || !supabase) return NextResponse.json({ success: false, message: "Missing params or Supabase client" });

    delete apiCache[key];

    // Handle System Settings keys
    if (settingsKeys.includes(key)) {
      const settingPayload = {
        id: `setting_${key}`,
        name: key,
        short_desc: JSON.stringify(value),
        long_desc: "System Setting",
      };
      await supabase.from("services").upsert([settingPayload], { onConflict: "id" });
      return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, max-age=0" } });
    }

    const tableName = tableMap[key];
    if (!tableName) return NextResponse.json({ success: false, message: "Invalid key" });

    if (Array.isArray(value)) {
      if (value.length > 0) {
        const safeRecords = value
          .map((item: any) => {
            if (!item || typeof item !== "object") return null;

            if (tableName === "enquiries") {
              return {
                id: String(item.id || `enq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
                name: item.name || item.customerName || "Valued Client",
                email: item.email || "guest@traveler.com",
                phone: item.phone || "Not Provided",
                type: item.type || "Package",
                subject: item.subject || item.packageOrItemName || "Travel Booking",
                message: item.message || item.notes || "",
                travel_date: item.travel_date || item.travelDate || "",
                preferred_time: item.preferred_time || item.preferredTime || "",
                guests_count: Number(item.guests_count || item.guestsCount || item.guests || 1),
                total_amount: Number(item.total_amount || item.totalAmount || 0),
                status: item.status || "New",
                created_at: item.created_at || item.createdAt || new Date().toISOString(),
              };
            }

            if (tableName === "packages") {
              let rawText = item.shortDesc || item.short_desc || item.description || "Bespoke luxury tour package.";
              if (typeof rawText === "string" && rawText.trim().startsWith("{") && rawText.trim().endsWith("}")) {
                try {
                  const parsed = JSON.parse(rawText);
                  rawText = parsed.text || parsed.description || "Bespoke luxury tour package.";
                } catch (e) {}
              }

              const incArr = Array.isArray(item.included) ? item.included.map(String) : [];
              const excArr = Array.isArray(item.excluded) ? item.excluded.map(String) : [];
              const itinArr = Array.isArray(item.itinerary) ? item.itinerary : [];

              const packageMetadata = {
                text: rawText,
                included: incArr,
                excluded: excArr,
                itinerary: itinArr,
              };

              const galleryArr = Array.isArray(item.gallery) ? item.gallery : [];

              return {
                id: String(item.id || `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
                name: item.name || "Luxury Tour Package",
                destination: item.destination || "Global Destination",
                duration: item.duration || "5 Days / 4 Nights",
                price: Number(item.price || 1999),
                discount_price: Number(item.discount_price ?? item.discountPrice ?? item.price ?? 1999),
                image: filterUrl(item.image) || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
                rating: Number(item.rating || 4.9),
                reviews_count: Number(item.reviews_count ?? item.reviewsCount ?? 15),
                featured: Boolean(item.featured),
                active: item.active !== undefined ? Boolean(item.active) : true,
                description: JSON.stringify(packageMetadata),
                gallery: filterUrlArray(galleryArr),
                map_location: item.map_location || item.mapLocation || null,
                video_url: filterUrl(item.video_url || item.videoUrl) || null,
                created_at: item.created_at || item.createdAt || new Date().toISOString(),
              };
            }

            if (tableName === "testimonials") {
              return {
                id: String(item.id || `test-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
                name: item.name || item.customerName || "Valued Guest",
                role: item.role || "Explorer",
                location: item.location || "Global Guest",
                avatar: filterUrl(item.avatar) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
                rating: Number(item.rating || 5),
                trip: item.trip || "Luxury Expedition",
                comment: item.comment || item.message || "",
                status: item.status || "Pending",
                created_at: item.created_at || item.createdAt || item.date || new Date().toISOString(),
              };
            }

            if (tableName === "flights") {
              const fpRaw = item.fare_price ?? item.farePrice;
              const cleanFp = (fpRaw !== undefined && fpRaw !== null && fpRaw !== "" && Number(fpRaw) > 0) ? Number(fpRaw) : 0;
              return {
                id: String(item.id || `flt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
                airline_name: item.airline_name || item.airlineName || "VIP Airline",
                airline_logo: item.airline_logo || item.airlineLogo || "✈️",
                from_city: item.from_city || item.fromCity || "New York",
                from_code: item.from_code || item.fromCode || "JFK",
                to_city: item.to_city || item.toCity || "Dubai",
                to_code: item.to_code || item.toCode || "DXB",
                trip_type: item.trip_type || item.tripType || "Round Trip",
                travel_class: item.travel_class || item.travelClass || "First Class",
                travel_date: item.travel_date || item.travelDate || "",
                duration: item.duration || "8h 30m",
                fare_price: cleanFp,
                currency: item.currency || "₹",
                offer_badge: item.offer_badge || item.offerBadge || "Special Rate",
                seats_available: Number(item.seats_available ?? item.seatsAvailable ?? 4),
                booking_link: item.booking_link || item.bookingLink || "#book-flight",
                featured: Boolean(item.featured),
                active: item.active !== undefined ? Boolean(item.active) : true,
              };
            }

            if (tableName === "albums") {
              const rawImages = Array.isArray(item.images) ? item.images : [];
              const cleanImages = rawImages
                .map((img: any) => {
                  if (typeof img === "string") {
                    const url = filterUrl(img);
                    return url ? { id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, url, type: "image", title: "", caption: "", displayOrder: 0 } : null;
                  }
                  if (img && typeof img === "object") {
                    const url = filterUrl(img.url);
                    if (!url) return null;
                    return { ...img, url };
                  }
                  return null;
                })
                .filter(Boolean);

              const rawVideos = Array.isArray(item.videos) ? item.videos : [];
              const cleanVideos = rawVideos
                .map((vid: any) => {
                  if (typeof vid === "string") {
                    const url = filterUrl(vid);
                    return url ? { id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, url, type: "video", title: "", caption: "", displayOrder: 0 } : null;
                  }
                  if (vid && typeof vid === "object") {
                    const url = filterUrl(vid.url);
                    if (!url) return null;
                    return { ...vid, url };
                  }
                  return null;
                })
                .filter(Boolean);

              return {
                id: String(item.id || `alb-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
                name: item.name || "Luxury Album",
                destination: item.destination || item.location || "Destination",
                country: item.country || "Global",
                category: item.category || "Destinations",
                cover_image: filterUrl(item.cover_image || item.coverImage || item.image) || "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
                short_desc: item.short_desc || item.shortDesc || item.description || "Luxury travel photo album.",
                long_desc: item.long_desc || item.longDesc || "",
                travel_date: item.travel_date || item.travelDate || "2026",
                featured: Boolean(item.featured),
                active: item.active !== undefined ? Boolean(item.active) : true,
                display_order: Number(item.display_order ?? item.displayOrder ?? 1),
                images: cleanImages,
                videos: cleanVideos,
              };
            }

            if (tableName === "services") {
              const descVal = item.short_desc || item.shortDesc || item.description || item.long_desc || item.longDesc || "VIP Concierge Service.";
              return {
                id: String(item.id || `srv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
                name: item.name || item.title || "Bespoke Service",
                title: item.title || item.name || "Bespoke Service",
                category: item.category || "Concierge",
                icon_name: item.icon_name || item.iconName || "Compass",
                image: filterUrl(item.image) || "",
                short_desc: descVal,
                long_desc: item.long_desc || item.longDesc || descVal,
                cta_text: item.cta_text || item.ctaText || "Learn More",
                display_order: Number(item.display_order ?? item.displayOrder ?? 1),
                active: item.active !== undefined ? Boolean(item.active) : true,
              };
            }

            if (tableName === "hotels") {
              const imagesArr = Array.isArray(item.images) ? item.images : [];
              const facilitiesArr = Array.isArray(item.facilities) ? item.facilities : [];
              return {
                id: String(item.id || `htl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
                name: item.name || "Luxury Hotel",
                location: item.location || "Global Location",
                image: filterUrl(item.image) || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                images: filterUrlArray(imagesArr),
                rating: Number(item.rating || 5.0),
                price_per_night: Number(item.price_per_night ?? item.pricePerNight ?? 500),
                currency: item.currency || "$",
                facilities: facilitiesArr,
                description: item.description || "",
                booking_link: item.booking_link || item.bookingLink || "",
                featured: Boolean(item.featured),
                active: item.active !== undefined ? Boolean(item.active) : true,
              };
            }

            if (tableName === "media_library") {
              return {
                id: String(item.id || `med-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
                name: item.name || "Media Asset",
                url: filterUrl(item.url) || "",
                type: item.type || "image",
                category: item.category || "Gallery",
                upload_date: item.upload_date || item.uploadDate || new Date().toISOString().split("T")[0],
                created_at: item.created_at || new Date().toISOString(),
              };
            }

            return item;
          })
          .filter(Boolean);

        // Step 1: Upsert clean records
        if (safeRecords.length > 0) {
          const { error: upsertError } = await supabase.from(tableName).upsert(safeRecords, { onConflict: "id" });
          if (upsertError) {
            console.error(`Supabase upsert failure for ${tableName}:`, upsertError);
            return NextResponse.json({ success: false, error: upsertError.message });
          }
        }
      }

      // Step 2: Reconcile & Delete removed IDs sequentially after successful upsert
      const { data: dbRows } = await supabase.from(tableName).select("id");
      if (dbRows && dbRows.length > 0) {
        const currentIds = new Set(value.map((v: any) => String(v.id)));
        const deletedIds = dbRows
          .filter((r: any) => !currentIds.has(String(r.id)) && !String(r.id).startsWith("setting_"))
          .map((r: any) => r.id);
        if (deletedIds.length > 0) {
          const { error: deleteErr } = await supabase.from(tableName).delete().in("id", deletedIds);
          if (deleteErr) {
            console.error(`Supabase deletion warning for ${tableName}:`, deleteErr);
          }
        }
      } else if (value.length === 0) {
        await supabase.from(tableName).delete().neq("id", "impossible-id-xyz");
      }
    }

    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

export async function DELETE(req: Request) {
  try {
    const { key, id } = await req.json();
    if (!key || !id || !supabase) return NextResponse.json({ success: false, message: "Missing key or ID" });

    delete apiCache[key];

    const tableName = tableMap[key];
    if (!tableName) return NextResponse.json({ success: false, message: "Invalid key" });

    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
