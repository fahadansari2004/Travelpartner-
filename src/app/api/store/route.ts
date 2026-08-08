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

    // Check fast in-memory cache (sub-millisecond response time)
    const cached = apiCache[key];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(
        { success: true, data: cached.data },
        { headers: { "Cache-Control": "public, max-age=5, stale-while-revalidate=30" } }
      );
    }

    // Handle System Settings keys stored in services table
    if (settingsKeys.includes(key)) {
      const { data: settingRow } = await supabase.from("services").select("*").eq("id", `setting_${key}`).maybeSingle();
      if (settingRow && settingRow.short_desc) {
        try {
          const parsed = JSON.parse(settingRow.short_desc);
          apiCache[key] = { timestamp: Date.now(), data: parsed };
          return NextResponse.json({ success: true, data: parsed }, { headers: { "Cache-Control": "public, max-age=5, stale-while-revalidate=30" } });
        } catch (e) {}
      }
      return NextResponse.json({ success: true, data: null });
    }

    const { data, error } = await supabase.from(tableName).select("*");
    if (error) return NextResponse.json({ success: false, error: error.message, data: [] });

    // Map PostgreSQL columns to React camelCase properties
    const mappedData = (data || [])
      .filter((item: any) => !item.id?.startsWith("setting_"))
      .map((item: any) => {
        // Parse the packed description JSON (used for packages)
        let rawDesc = item.description || "";
        let parsedIncluded: string[] = [];
        let parsedExcluded: string[] = [];
        let parsedItinerary: any[] = [];
        let cleanDesc = item.short_desc || item.shortDesc || "";

        if (typeof rawDesc === "string" && rawDesc.trim().startsWith("{") && rawDesc.trim().endsWith("}")) {
          try {
            const parsed = JSON.parse(rawDesc);
            cleanDesc = parsed.text || parsed.description || cleanDesc || "Bespoke luxury tour package.";
            if (Array.isArray(parsed.included)) parsedIncluded = parsed.included;
            if (Array.isArray(parsed.excluded)) parsedExcluded = parsed.excluded;
            if (Array.isArray(parsed.itinerary)) parsedItinerary = parsed.itinerary;
          } catch (e) {}
        } else if (rawDesc) {
          cleanDesc = rawDesc;
        }

        if (!cleanDesc || cleanDesc.trim().startsWith("{")) {
          cleanDesc = "Bespoke luxury tour package.";
        }

        let serviceDesc = item.short_desc || item.long_desc || item.shortDesc || item.longDesc || cleanDesc || "";

        // Parse gallery (stored as JSONB array of strings)
        const gallery = safeParseJson(item.gallery, []);
        const galleryUrls = Array.isArray(gallery) ? gallery : [];

        // Parse images (stored as JSONB array — could be strings or objects)
        let imagesArr = safeParseJson(item.images, []);
        if (!Array.isArray(imagesArr)) imagesArr = [];

        // Parse videos (stored as JSONB array)
        let videosArr = safeParseJson(item.videos, []);
        if (!Array.isArray(videosArr)) videosArr = [];

        return {
          ...item,
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
          // gallery as array of URL strings
          gallery: galleryUrls,
          // images/videos as arrays (may be objects or strings)
          images: imagesArr,
          videos: videosArr,
          included: parsedIncluded.length > 0 ? parsedIncluded : (Array.isArray(item.included) ? item.included : safeParseJson(item.included, [])),
          excluded: parsedExcluded.length > 0 ? parsedExcluded : (Array.isArray(item.excluded) ? item.excluded : safeParseJson(item.excluded, [])),
          itinerary: parsedItinerary.length > 0 ? parsedItinerary : safeParseJson(item.itinerary, []),
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
          farePrice: item.fare_price ?? item.farePrice,
          offerBadge: item.offer_badge || item.offerBadge,
          seatsAvailable: item.seats_available ?? item.seatsAvailable,
          bookingLink: item.booking_link || item.bookingLink,
          pricePerNight: item.price_per_night ?? item.pricePerNight,
          iconName: item.icon_name || item.iconName,
          ctaText: item.cta_text || item.ctaText,
          displayOrder: item.display_order ?? item.displayOrder ?? 1,
        };
      });

    apiCache[key] = { timestamp: Date.now(), data: mappedData };

    return NextResponse.json(
      { success: true, data: mappedData },
      { headers: { "Cache-Control": "public, max-age=5, stale-while-revalidate=30" } }
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
        const safeRecords = value.map((item: any) => {
          const clean: any = { ...item };

          if (tableName === "enquiries") {
            return {
              id: item.id || `enq-${Date.now()}`,
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
              created_at: item.created_at || new Date().toISOString(),
            };
          }

          if (tableName === "packages") {
            let rawText = clean.shortDesc || clean.short_desc || clean.description || "Bespoke luxury tour package.";
            if (typeof rawText === "string" && rawText.trim().startsWith("{") && rawText.trim().endsWith("}")) {
              try {
                const parsed = JSON.parse(rawText);
                rawText = parsed.text || parsed.description || "Bespoke luxury tour package.";
              } catch (e) {}
            }

            const packageMetadata = {
              text: rawText,
              included: Array.isArray(clean.included) ? clean.included : [],
              excluded: Array.isArray(clean.excluded) ? clean.excluded : [],
              itinerary: Array.isArray(clean.itinerary) ? clean.itinerary : [],
            };

            clean.name = clean.name || "Luxury Tour Package";
            clean.destination = clean.destination || "Global Destination";
            clean.duration = clean.duration || "5 Days / 4 Nights";
            clean.price = Number(clean.price || 1999);
            clean.discount_price = Number(clean.discount_price ?? clean.discountPrice ?? clean.price);
            clean.rating = Number(clean.rating || 4.9);
            clean.reviews_count = Number(clean.reviews_count ?? clean.reviewsCount ?? 15);
            // Keep image URL (filter base64 just in case)
            clean.image = filterUrl(clean.image) || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34";
            clean.short_desc = rawText;
            clean.description = JSON.stringify(packageMetadata);
            clean.featured = Boolean(clean.featured);
            clean.active = clean.active !== undefined ? Boolean(clean.active) : true;
            clean.created_at = clean.created_at || new Date().toISOString();

            // Preserve gallery as JSONB array of URL strings
            const galleryArr = Array.isArray(clean.gallery) ? clean.gallery : [];
            clean.gallery = filterUrlArray(galleryArr);

            // Map camelCase → snake_case and remove camelCase duplicates
            clean.map_location = clean.mapLocation || clean.map_location || null;
            clean.video_url = filterUrl(clean.videoUrl || clean.video_url) || null;

            delete clean.discountPrice;
            delete clean.reviewsCount;
            delete clean.shortDesc;
            delete clean.itinerary;
            delete clean.included;
            delete clean.excluded;
            delete clean.mapLocation;
            delete clean.videoUrl;

            return clean;
          }

          if (tableName === "testimonials") {
            clean.name = clean.name || clean.customerName || "Valued Guest";
            clean.role = clean.role || "Explorer";
            clean.location = clean.location || "Global Guest";
            clean.avatar = filterUrl(clean.avatar) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb";
            clean.rating = Number(clean.rating || 5);
            clean.trip = clean.trip || "Luxury Expedition";
            clean.comment = clean.comment || clean.message || "";
            clean.status = clean.status || "Pending";
            clean.created_at = clean.created_at || clean.createdAt || clean.date || new Date().toISOString();

            delete clean.customerName;
            delete clean.packageOrItemName;
            delete clean.packageName;
            delete clean.subject;
            delete clean.message;
            delete clean.notes;
            delete clean.guestsCount;
            delete clean.guests;
            delete clean.travelDate;
            delete clean.date;
            delete clean.createdAt;
          }

          if (tableName === "flights") {
            clean.airline_name = clean.airline_name || clean.airlineName || "Vip Airline";
            clean.airline_logo = clean.airline_logo || clean.airlineLogo || "✈️";
            clean.from_city = clean.from_city || clean.fromCity || "New York";
            clean.from_code = clean.from_code || clean.fromCode || "JFK";
            clean.to_city = clean.to_city || clean.toCity || "Dubai";
            clean.to_code = clean.to_code || clean.toCode || "DXB";
            clean.trip_type = clean.trip_type || clean.tripType || "Round Trip";
            clean.travel_class = clean.travel_class || clean.travelClass || "First Class";
            clean.travel_date = clean.travel_date || clean.travelDate || "";
            clean.duration = clean.duration || "8h 30m";
            clean.fare_price = Number(clean.fare_price ?? clean.farePrice ?? 1000);
            clean.currency = clean.currency || "$";
            clean.offer_badge = clean.offer_badge || clean.offerBadge || "Special Rate";
            clean.seats_available = Number(clean.seats_available ?? clean.seatsAvailable ?? 4);
            clean.booking_link = clean.booking_link || clean.bookingLink || "#book-flight";
            clean.featured = Boolean(clean.featured);
            clean.active = clean.active !== undefined ? Boolean(clean.active) : true;

            delete clean.airlineName;
            delete clean.airlineLogo;
            delete clean.fromCity;
            delete clean.fromCode;
            delete clean.toCity;
            delete clean.toCode;
            delete clean.tripType;
            delete clean.travelClass;
            delete clean.travelDate;
            delete clean.farePrice;
            delete clean.offerBadge;
            delete clean.seatsAvailable;
            delete clean.bookingLink;
          }

          if (tableName === "hotels") {
            clean.name = clean.name || "Luxury Resort";
            clean.location = clean.location || "Global Location";
            // Use real URL only (filter base64)
            const mainImg = filterUrl(clean.image) ||
              (Array.isArray(clean.images) ? filterUrl(clean.images[0]) : "") ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945";
            clean.image = mainImg;
            // Store images array as JSONB with only real URLs
            const imagesArr = Array.isArray(clean.images) ? clean.images : (mainImg ? [mainImg] : []);
            clean.images = filterUrlArray(imagesArr.map((i: any) => (typeof i === "string" ? i : i?.url || "")));
            if (clean.images.length === 0 && mainImg) clean.images = [mainImg];
            clean.rating = Number(clean.rating || 5);
            clean.price_per_night = Number(clean.price_per_night ?? clean.pricePerNight ?? 500);
            clean.currency = clean.currency || "$";
            clean.description = clean.description || "5-star luxury stay.";
            clean.booking_link = clean.booking_link || clean.bookingLink || "#book-hotel";
            clean.featured = Boolean(clean.featured);
            clean.active = clean.active !== undefined ? Boolean(clean.active) : true;

            delete clean.pricePerNight;
            delete clean.bookingLink;
          }

          if (tableName === "albums") {
            clean.name = clean.name || "Luxury Album";
            clean.destination = clean.destination || clean.location || "Destination";
            clean.country = clean.country || "Global";
            clean.category = clean.category || "Destinations";
            const coverImg = filterUrl(clean.cover_image || clean.coverImage || clean.image) ||
              "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99";
            clean.cover_image = coverImg;
            clean.short_desc = clean.short_desc || clean.shortDesc || clean.description || "Luxury travel photo album.";
            clean.long_desc = clean.long_desc || clean.longDesc || clean.shortDesc || "";
            clean.travel_date = clean.travel_date || clean.travelDate || "2026";
            clean.featured = Boolean(clean.featured);
            clean.active = clean.active !== undefined ? Boolean(clean.active) : true;

            // FIX: Store images as JSONB array of objects {id, title, url, type, caption, displayOrder}
            // Filter out any base64 URLs from image objects
            const rawImages = Array.isArray(clean.images) ? clean.images : [];
            clean.images = rawImages
              .map((img: any) => {
                if (typeof img === "string") {
                  const url = filterUrl(img);
                  return url ? { id: `img-${Date.now()}-${Math.random()}`, url, type: "image", title: "", caption: "", displayOrder: 0 } : null;
                }
                if (img && typeof img === "object") {
                  const url = filterUrl(img.url);
                  if (!url) return null;
                  return { ...img, url };
                }
                return null;
              })
              .filter(Boolean);

            const rawVideos = Array.isArray(clean.videos) ? clean.videos : [];
            clean.videos = rawVideos
              .map((vid: any) => {
                if (typeof vid === "string") {
                  const url = filterUrl(vid);
                  return url ? { id: `vid-${Date.now()}-${Math.random()}`, url, type: "video", title: "", caption: "", displayOrder: 0 } : null;
                }
                if (vid && typeof vid === "object") {
                  const url = filterUrl(vid.url);
                  if (!url) return null;
                  return { ...vid, url };
                }
                return null;
              })
              .filter(Boolean);

            delete clean.coverImage;
            delete clean.shortDesc;
            delete clean.longDesc;
            delete clean.travelDate;
            delete clean.displayOrder;
            delete clean.display_order;
            delete clean.location;
            delete clean.image;
            delete clean.description;
            delete clean.seoTitle;
            delete clean.seoDescription;
            delete clean.relatedPackageId;
          }

          if (tableName === "media_library") {
            clean.name = clean.name || clean.title || "Media Asset";
            // Only store real URLs — filter base64
            clean.url = filterUrl(clean.url || clean.imageUrl || clean.src) || "";
            clean.type = clean.type || "image";
            clean.category = clean.category || "Gallery";
            clean.upload_date = clean.upload_date || clean.uploadDate || new Date().toISOString().split("T")[0];

            delete clean.uploadDate;
            delete clean.imageUrl;
            delete clean.src;

            // Skip records with no valid URL
            if (!clean.url) return null;
          }

          if (tableName === "services") {
            const descVal = clean.shortDesc || clean.description || clean.short_desc || clean.longDesc || clean.long_desc || "VIP Concierge Service.";
            clean.name = clean.name || clean.title || "Bespoke Service";
            clean.short_desc = descVal;
            clean.long_desc = clean.longDesc || clean.long_desc || descVal;
            clean.icon_name = clean.iconName || clean.icon_name || "Compass";
            clean.image = filterUrl(clean.image) || "";
            clean.cta_text = clean.ctaText || clean.cta_text || "Learn More";
            clean.display_order = Number(clean.displayOrder ?? clean.display_order ?? 1);
            clean.active = clean.active !== undefined ? Boolean(clean.active) : true;

            delete clean.iconName;
            delete clean.shortDesc;
            delete clean.longDesc;
            delete clean.ctaText;
            delete clean.displayOrder;
          }

          return clean;
        }).filter(Boolean); // Remove null records (e.g. media items with no URL)

        // Step 1: Upsert remaining active records
        if (safeRecords.length > 0) {
          const { error: upsertError } = await supabase.from(tableName).upsert(safeRecords, { onConflict: "id" });
          if (upsertError) {
            console.error(`Supabase upsert warning for ${tableName}:`, upsertError);
          }
        }
      }

      // Step 2: Reconcile & Delete removed IDs sequentially after upsert
      const { data: dbRows } = await supabase.from(tableName).select("id");
      if (dbRows && dbRows.length > 0) {
        const currentIds = new Set(value.map((v: any) => v.id));
        const deletedIds = dbRows
          .filter((r: any) => !currentIds.has(r.id) && !r.id.startsWith("setting_"))
          .map((r: any) => r.id);
        if (deletedIds.length > 0) {
          const { error: deleteErr } = await supabase.from(tableName).delete().in("id", deletedIds);
          if (deleteErr) {
            console.error(`Supabase deletion warning for ${tableName}:`, deleteErr);
            for (const delId of deletedIds) {
              await supabase.from(tableName).delete().eq("id", delId);
            }
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
