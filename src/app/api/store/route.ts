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
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key || !supabase) return NextResponse.json({ success: false, error: "No Supabase client configured", data: [] });

    const tableName = tableMap[key];
    if (!tableName) return NextResponse.json({ success: false, error: "Invalid key", data: [] });

    const { data, error } = await supabase.from(tableName).select("*");
    if (error) return NextResponse.json({ success: false, error: error.message, data: [] });

    // Map PostgreSQL columns to React camelCase properties
    const mappedData = (data || []).map((item: any) => {
      let rawDesc = item.description || "";
      let parsedIncluded: string[] = [];
      let parsedExcluded: string[] = [];
      let parsedItinerary: any[] = [];
      let cleanDesc = rawDesc;

      if (typeof rawDesc === "string" && rawDesc.trim().startsWith("{") && rawDesc.trim().endsWith("}")) {
        try {
          const parsed = JSON.parse(rawDesc);
          cleanDesc = parsed.text || parsed.description || cleanDesc;
          if (Array.isArray(parsed.included)) parsedIncluded = parsed.included;
          if (Array.isArray(parsed.excluded)) parsedExcluded = parsed.excluded;
          if (Array.isArray(parsed.itinerary)) parsedItinerary = parsed.itinerary;
        } catch (e) {}
      }

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
        coverImage: item.image || item.cover_image || item.coverImage,
        shortDesc: cleanDesc,
        description: cleanDesc,
        included: parsedIncluded.length > 0 ? parsedIncluded : item.included,
        excluded: parsedExcluded.length > 0 ? parsedExcluded : item.excluded,
        itinerary: parsedItinerary.length > 0 ? parsedItinerary : item.itinerary,
        longDesc: cleanDesc,
        discountPrice: item.discount_price ?? item.discountPrice ?? item.price,
        uploadDate: item.upload_date || item.uploadDate,
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
        displayOrder: item.display_order ?? item.displayOrder,
      };
    });

    return NextResponse.json(
      { success: true, data: mappedData },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { key, value } = await req.json();
    if (!key || !value || !supabase) return NextResponse.json({ success: false, message: "Missing params or Supabase client" });

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
            const rawText = clean.description || clean.shortDesc || "Bespoke luxury tour package.";
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
            clean.image = clean.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34";
            clean.description = JSON.stringify(packageMetadata);
            clean.featured = Boolean(clean.featured);
            clean.active = clean.active !== undefined ? Boolean(clean.active) : true;
            clean.created_at = clean.created_at || new Date().toISOString();

            delete clean.discountPrice;
            delete clean.reviewsCount;
            delete clean.shortDesc;
            delete clean.itinerary;
            delete clean.gallery;
            delete clean.included;
            delete clean.excluded;
            delete clean.mapLocation;
            delete clean.videoUrl;
          }

          if (tableName === "testimonials") {
            clean.name = clean.name || clean.customerName || "Valued Guest";
            clean.role = clean.role || "Explorer";
            clean.location = clean.location || "Global Guest";
            clean.avatar = clean.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb";
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
            clean.image = clean.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945";
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

          if (tableName === "services") {
            clean.name = clean.name || "Bespoke Service";
            clean.short_desc = clean.short_desc || clean.shortDesc || "VIP Concierge Service.";
            clean.long_desc = clean.long_desc || clean.longDesc || "VIP Concierge Service.";
            clean.icon_name = clean.icon_name || clean.iconName || "Compass";
            clean.cta_text = clean.cta_text || clean.ctaText || "Learn More";
            clean.display_order = Number(clean.display_order ?? clean.displayOrder ?? 1);
            clean.active = clean.active !== undefined ? Boolean(clean.active) : true;

            delete clean.iconName;
            delete clean.shortDesc;
            delete clean.longDesc;
            delete clean.ctaText;
            delete clean.displayOrder;
          }

          return clean;
        });

        // Step 1: Upsert remaining active records
        const { error: upsertError } = await supabase.from(tableName).upsert(safeRecords, { onConflict: "id" });
        if (upsertError) {
          console.error(`Supabase upsert warning for ${tableName}:`, upsertError);
        }
      }

      // Step 2: Reconcile & Delete removed IDs sequentially after upsert
      const { data: dbRows } = await supabase.from(tableName).select("id");
      if (dbRows && dbRows.length > 0) {
        const currentIds = new Set(value.map((v: any) => v.id));
        const deletedIds = dbRows.filter((r: any) => !currentIds.has(r.id)).map((r: any) => r.id);
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
