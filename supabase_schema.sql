-- ====================================================================
-- FULL PRODUCTION TABLE CREATION & SECURITY SCRIPT FOR TRAVEL PARTNER
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- ====================================================================

-- 1. Create Database Tables
CREATE TABLE IF NOT EXISTS public.albums (
  id text PRIMARY KEY,
  title text,
  cover_image text,
  short_desc text,
  long_desc text,
  travel_date text,
  photos text[],
  featured boolean default false,
  active boolean default true
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id text PRIMARY KEY,
  name text,
  role text,
  location text,
  avatar text,
  rating integer default 5,
  trip text,
  comment text,
  status text default 'Pending',
  created_at text
);

CREATE TABLE IF NOT EXISTS public.enquiries (
  id text PRIMARY KEY,
  type text default 'Package',
  package_name text,
  customer_name text,
  email text,
  phone text,
  travel_date text,
  guests integer default 1,
  notes text,
  status text default 'New',
  created_at text
);

CREATE TABLE IF NOT EXISTS public.packages (
  id text PRIMARY KEY,
  name text,
  destination text,
  duration text,
  price numeric,
  discount_price numeric,
  image text,
  rating numeric default 5.0,
  reviews_count integer default 0,
  featured boolean default false,
  active boolean default true,
  short_desc text,
  description text,
  itinerary jsonb,
  gallery text[],
  included text[],
  excluded text[],
  map_location text,
  video_url text
);

CREATE TABLE IF NOT EXISTS public.media_library (
  id text PRIMARY KEY,
  name text,
  url text,
  category text,
  type text default 'image',
  upload_date text
);

CREATE TABLE IF NOT EXISTS public.flights (
  id text PRIMARY KEY,
  airline_name text,
  airline_logo text,
  from_city text,
  from_code text,
  to_city text,
  to_code text,
  trip_type text,
  travel_class text,
  travel_date text,
  duration text,
  fare_price numeric,
  currency text default '$',
  offer_badge text,
  seats_available integer default 5,
  booking_link text,
  featured boolean default false,
  active boolean default true
);

CREATE TABLE IF NOT EXISTS public.hotels (
  id text PRIMARY KEY,
  name text,
  location text,
  image text,
  images text[],
  rating numeric default 5.0,
  price_per_night numeric,
  currency text default '$',
  facilities text[],
  description text,
  booking_link text,
  featured boolean default false,
  active boolean default true
);

CREATE TABLE IF NOT EXISTS public.services (
  id text PRIMARY KEY,
  name text,
  title text,
  category text,
  icon_name text,
  image text,
  short_desc text,
  long_desc text,
  cta_text text,
  display_order integer default 1,
  active boolean default true
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 3. Drop old restrictive policies if exist
DROP POLICY IF EXISTS "Full Access Albums" ON public.albums;
DROP POLICY IF EXISTS "Full Access Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Full Access Enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Full Access Packages" ON public.packages;
DROP POLICY IF EXISTS "Full Access Media" ON public.media_library;
DROP POLICY IF EXISTS "Full Access Flights" ON public.flights;
DROP POLICY IF EXISTS "Full Access Hotels" ON public.hotels;
DROP POLICY IF EXISTS "Full Access Services" ON public.services;

-- 4. Create Full Access Policies
CREATE POLICY "Full Access Albums" ON public.albums FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Enquiries" ON public.enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Media" ON public.media_library FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Flights" ON public.flights FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Hotels" ON public.hotels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Services" ON public.services FOR ALL USING (true) WITH CHECK (true);
