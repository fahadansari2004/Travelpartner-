// ─── Destination ────────────────────────────────────────────────────────────
export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  category: DestinationCategory;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  gallery: string[];
  highlights: string[];
  duration: string;
  difficulty: TripDifficulty;
  featured: boolean;
  tags: string[];
}

export type DestinationCategory =
  | "beach"
  | "mountain"
  | "city"
  | "cultural"
  | "adventure"
  | "luxury"
  | "wildlife";

export type TripDifficulty = "easy" | "moderate" | "challenging";

// ─── Booking ─────────────────────────────────────────────────────────────────
export interface BookingDetails {
  destinationId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType: RoomType;
  addOns: AddOn[];
  totalPrice: number;
  contactInfo: ContactInfo;
}

export type RoomType = "standard" | "deluxe" | "suite" | "villa";

export interface AddOn {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// ─── Filter Options ──────────────────────────────────────────────────────────
export interface FilterOptions {
  search: string;
  category: DestinationCategory | "all";
  minPrice: number;
  maxPrice: number;
  minRating: number;
  difficulty: TripDifficulty | "all";
  sortBy: SortOption;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "name";

// ─── API Response ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  pageSize: number;
  success: boolean;
  error?: string;
}

// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

// ─── Animation ───────────────────────────────────────────────────────────────
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  start?: string;
  end?: string;
}
