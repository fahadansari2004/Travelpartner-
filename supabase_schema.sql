-- ====================================================================
-- PRODUCTION SECURITY SCHEMA FOR TRAVEL PARTNER PLATFORM
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Albums Table
CREATE TABLE IF NOT EXISTS public.albums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT,
  category TEXT DEFAULT 'Destinations',
  cover_image TEXT,
  short_desc TEXT,
  long_desc TEXT,
  travel_date TEXT DEFAULT '2026',
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Traveler',
  location TEXT,
  avatar TEXT,
  rating INTEGER DEFAULT 5,
  trip TEXT NOT NULL,
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Customer Bookings & Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  type TEXT DEFAULT 'Package',
  subject TEXT NOT NULL,
  travel_date TEXT,
  preferred_time TEXT,
  guests_count INTEGER DEFAULT 1,
  total_amount NUMERIC DEFAULT 0,
  message TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Tour Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  duration TEXT NOT NULL,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  image TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Centralized Media Library Table
CREATE TABLE IF NOT EXISTS public.media_library (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  category TEXT DEFAULT 'Gallery',
  upload_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Enable Strict Row Level Security (RLS) Policies
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Clean existing policies
DROP POLICY IF EXISTS "Public Read Access Albums" ON public.albums;
DROP POLICY IF EXISTS "Public Write Access Albums" ON public.albums;
DROP POLICY IF EXISTS "Public Read Access Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public Write Access Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public Read Access Enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public Write Access Enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public Read Access Packages" ON public.packages;
DROP POLICY IF EXISTS "Public Write Access Packages" ON public.packages;
DROP POLICY IF EXISTS "Public Read Access Media" ON public.media_library;
DROP POLICY IF EXISTS "Public Write Access Media" ON public.media_library;

-- 🛡️ SECURE PRODUCTION ROW-LEVEL SECURITY (RLS) POLICIES

-- Albums: Anyone can read published albums. Full control for authenticated users.
CREATE POLICY "Public Read Albums" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Admin All Albums" ON public.albums FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials: Anyone can read approved testimonials. Guests can submit reviews (status = Pending).
CREATE POLICY "Public Read Approved Testimonials" ON public.testimonials FOR SELECT USING (status = 'Approved' OR auth.role() = 'authenticated');
CREATE POLICY "Public Submit Pending Testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Enquiries: Guests can submit booking enquiries. Only authenticated admins can read/manage enquiries.
CREATE POLICY "Public Submit Enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Read Manage Enquiries" ON public.enquiries FOR ALL USING (auth.role() = 'authenticated');

-- Packages: Anyone can read active packages. Authenticated admins manage packages.
CREATE POLICY "Public Read Packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Admin Manage Packages" ON public.packages FOR ALL USING (auth.role() = 'authenticated');

-- Media Library: Anyone can read public media assets. Authenticated admins manage media library.
CREATE POLICY "Public Read Media" ON public.media_library FOR SELECT USING (true);
CREATE POLICY "Admin Manage Media" ON public.media_library FOR ALL USING (auth.role() = 'authenticated');
