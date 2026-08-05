import { type NextRequest, NextResponse } from "next/server";
import { mockDestinations } from "@/data/mockDestinations";
import type { ApiResponse, Destination, DestinationCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search   = searchParams.get("search")?.toLowerCase() ?? "";
  const category = searchParams.get("category") as DestinationCategory | "all" | null;
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? Infinity);
  const minRating = Number(searchParams.get("minRating") ?? 0);
  const featured  = searchParams.get("featured");
  const page      = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize  = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 12)));

  let results = mockDestinations.filter((dest) => {
    if (search && !dest.name.toLowerCase().includes(search) &&
        !dest.country.toLowerCase().includes(search) &&
        !dest.description.toLowerCase().includes(search) &&
        !dest.tags.some((t) => t.includes(search))) {
      return false;
    }
    if (category && category !== "all" && dest.category !== category) return false;
    if (dest.price < minPrice || dest.price > maxPrice) return false;
    if (dest.rating < minRating) return false;
    if (featured === "true" && !dest.featured) return false;
    return true;
  });

  const total = results.length;
  const start = (page - 1) * pageSize;
  results = results.slice(start, start + pageSize);

  const response: ApiResponse<Destination[]> = {
    data: results,
    total,
    page,
    pageSize,
    success: true,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
