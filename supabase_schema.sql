-- ====================================================================
-- PRODUCTION FULL PERMISSIVE RLS SECURITY SCRIPT FOR TRAVEL PARTNER
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- ====================================================================

-- 1. Enable Row Level Security (RLS)
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- 2. Drop restrict policies
DROP POLICY IF EXISTS "Public Read Albums" ON public.albums;
DROP POLICY IF EXISTS "Admin All Albums" ON public.albums;
DROP POLICY IF EXISTS "Public Read Access Albums" ON public.albums;
DROP POLICY IF EXISTS "Public Write Access Albums" ON public.albums;

DROP POLICY IF EXISTS "Public Read Approved Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public Submit Pending Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin Manage Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public Read Access Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public Write Access Testimonials" ON public.testimonials;

DROP POLICY IF EXISTS "Public Submit Enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admin Read Manage Enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public Read Access Enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public Write Access Enquiries" ON public.enquiries;

DROP POLICY IF EXISTS "Public Read Packages" ON public.packages;
DROP POLICY IF EXISTS "Admin Manage Packages" ON public.packages;
DROP POLICY IF EXISTS "Public Read Access Packages" ON public.packages;
DROP POLICY IF EXISTS "Public Write Access Packages" ON public.packages;

DROP POLICY IF EXISTS "Public Read Media" ON public.media_library;
DROP POLICY IF EXISTS "Admin Manage Media" ON public.media_library;
DROP POLICY IF EXISTS "Public Read Access Media" ON public.media_library;
DROP POLICY IF EXISTS "Public Write Access Media" ON public.media_library;

-- 3. Create Full Permissive RLS Policies (Allow Read, Write, Update, Delete for Web App & Admin Panel)
CREATE POLICY "Full Access Albums" ON public.albums FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Enquiries" ON public.enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Media" ON public.media_library FOR ALL USING (true) WITH CHECK (true);
