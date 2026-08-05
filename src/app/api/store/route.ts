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

    // Map snake_case database columns back to React camelCase properties
    const mappedData = (data || []).map((item: any) => ({
      ...item,
      name: item.name || item.customer_name || item.customerName || "Valued Client",
      customerName: item.customerName || item.customer_name || item.name || "Valued Client",
      packageOrItemName: item.packageOrItemName || item.package_name || item.packageName || "Custom Booking",
      packageName: item.packageName || item.package_name || item.packageOrItemName || "Custom Booking",
      message: item.message || item.notes || "",
      guestsCount: item.guestsCount || item.guests || 1,
      travelDate: item.travelDate || item.travel_date || "",
      createdAt: item.createdAt || item.created_at || "",
      coverImage: item.coverImage || item.cover_image,
      shortDesc: item.shortDesc || item.short_desc,
      longDesc: item.longDesc || item.long_desc,
      discountPrice: item.discountPrice || item.discount_price,
      uploadDate: item.uploadDate || item.upload_date,
      reviewsCount: item.reviewsCount ?? item.reviews_count,
      mapLocation: item.mapLocation || item.map_location,
      videoUrl: item.videoUrl || item.video_url,
      airlineName: item.airlineName || item.airline_name,
      airlineLogo: item.airlineLogo || item.airline_logo,
      fromCity: item.fromCity || item.from_city,
      fromCode: item.fromCode || item.from_code,
      toCity: item.toCity || item.to_city,
      toCode: item.toCode || item.to_code,
      tripType: item.tripType || item.trip_type,
      travelClass: item.travelClass || item.travel_class,
      farePrice: item.farePrice ?? item.fare_price,
      offerBadge: item.offerBadge || item.offer_badge,
      seatsAvailable: item.seatsAvailable ?? item.seats_available,
      bookingLink: item.bookingLink || item.booking_link,
      pricePerNight: item.pricePerNight ?? item.price_per_night,
      iconName: item.iconName || item.icon_name,
      ctaText: item.ctaText || item.cta_text,
      displayOrder: item.displayOrder ?? item.display_order,
    }));

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

    if (Array.isArray(value) && value.length > 0) {
      const safeRecords = value.map((item: any) => {
        const clean: any = { ...item };

        // 1. Column snake_case mapping
        if (clean.name !== undefined && tableName === "enquiries") { clean.customer_name = clean.name; }
        if (clean.customerName !== undefined && tableName === "enquiries") { clean.customer_name = clean.customerName; }
        if (clean.packageOrItemName !== undefined && tableName === "enquiries") { clean.package_name = clean.packageOrItemName; }
        if (clean.packageName !== undefined && tableName === "enquiries") { clean.package_name = clean.packageName; }
        if (clean.message !== undefined && tableName === "enquiries") { clean.notes = clean.message; }
        if (clean.guestsCount !== undefined && tableName === "enquiries") { clean.guests = clean.guestsCount; }
        if (clean.travelDate !== undefined) { clean.travel_date = clean.travelDate; }
        if (clean.createdAt !== undefined) { clean.created_at = clean.createdAt; }
        if (clean.coverImage !== undefined) { clean.cover_image = clean.coverImage; }
        if (clean.shortDesc !== undefined) { clean.short_desc = clean.shortDesc; }
        if (clean.longDesc !== undefined) { clean.long_desc = clean.longDesc; }
        if (clean.discountPrice !== undefined) { clean.discount_price = clean.discountPrice; }
        if (clean.uploadDate !== undefined) { clean.upload_date = clean.uploadDate; }
        if (clean.reviewsCount !== undefined) { clean.reviews_count = clean.reviewsCount; }
        if (clean.mapLocation !== undefined) { clean.map_location = clean.mapLocation; }
        if (clean.videoUrl !== undefined) { clean.video_url = clean.videoUrl; }
        if (clean.airlineName !== undefined) { clean.airline_name = clean.airlineName; }
        if (clean.airlineLogo !== undefined) { clean.airline_logo = clean.airlineLogo; }
        if (clean.fromCity !== undefined) { clean.from_city = clean.fromCity; }
        if (clean.fromCode !== undefined) { clean.from_code = clean.fromCode; }
        if (clean.toCity !== undefined) { clean.to_city = clean.toCity; }
        if (clean.toCode !== undefined) { clean.to_code = clean.toCode; }
        if (clean.tripType !== undefined) { clean.trip_type = clean.tripType; }
        if (clean.travelClass !== undefined) { clean.travel_class = clean.travelClass; }
        if (clean.farePrice !== undefined) { clean.fare_price = clean.farePrice; }
        if (clean.offerBadge !== undefined) { clean.offer_badge = clean.offerBadge; }
        if (clean.seatsAvailable !== undefined) { clean.seats_available = clean.seatsAvailable; }
        if (clean.bookingLink !== undefined) { clean.booking_link = clean.bookingLink; }
        if (clean.pricePerNight !== undefined) { clean.price_per_night = clean.pricePerNight; }
        if (clean.iconName !== undefined) { clean.icon_name = clean.iconName; }
        if (clean.ctaText !== undefined) { clean.cta_text = clean.ctaText; }
        if (clean.displayOrder !== undefined) { clean.display_order = clean.displayOrder; }

        if (tableName === "enquiries") {
          const extraParts: string[] = [];
          if (clean.preferredTime) { extraParts.push(`Time: ${clean.preferredTime}`); }
          if (clean.totalAmount) { extraParts.push(`Total: $${clean.totalAmount}`); }
          if (extraParts.length > 0) {
            const extraStr = extraParts.join(" | ");
            clean.notes = clean.notes ? `${clean.notes} (${extraStr})` : extraStr;
          }
        }

        // 2. Strict deletion of non-PostgreSQL camelCase keys
        delete clean.customerName;
        delete clean.packageName;
        delete clean.packageOrItemName;
        delete clean.guestsCount;
        delete clean.travelDate;
        delete clean.createdAt;
        delete clean.coverImage;
        delete clean.shortDesc;
        delete clean.longDesc;
        delete clean.discountPrice;
        delete clean.uploadDate;
        delete clean.reviewsCount;
        delete clean.mapLocation;
        delete clean.videoUrl;
        delete clean.airlineName;
        delete clean.airlineLogo;
        delete clean.fromCity;
        delete clean.fromCode;
        delete clean.toCity;
        delete clean.toCode;
        delete clean.tripType;
        delete clean.travelClass;
        delete clean.farePrice;
        delete clean.offerBadge;
        delete clean.seatsAvailable;
        delete clean.bookingLink;
        delete clean.pricePerNight;
        delete clean.iconName;
        delete clean.ctaText;
        delete clean.displayOrder;
        delete clean.preferredTime;
        delete clean.totalAmount;

        return clean;
      });

      // 1. Upsert current active items with explicit onConflict key
      const { error: upsertError } = await supabase.from(tableName).upsert(safeRecords, { onConflict: "id" });
      if (upsertError) {
        console.error(`Supabase server upsert error for ${tableName}:`, upsertError);
        // Fallback: update status/fields record by record
        for (const rec of safeRecords) {
          const { error: updateErr } = await supabase.from(tableName).update(rec).eq("id", rec.id);
          if (updateErr) {
            await supabase.from(tableName).insert(rec);
          }
        }
      }

      // 2. Reconcile and delete missing items safely
      const { data: dbRows } = await supabase.from(tableName).select("id");
      if (dbRows && dbRows.length > 0) {
        const currentIds = new Set(value.map((v: any) => v.id));
        const deletedIds = dbRows.filter((r: any) => !currentIds.has(r.id)).map((r: any) => r.id);
        if (deletedIds.length > 0) {
          await supabase.from(tableName).delete().in("id", deletedIds);
        }
      }
    }

    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
