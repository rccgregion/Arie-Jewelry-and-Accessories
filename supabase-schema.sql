-- ====================================================================
-- ARIE JEWELRY & ACCESSORIES - COMPLETE SUPABASE POSTGRES SCHEMA
-- ====================================================================
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- This creates all required tables, indexes, RLS policies, and triggers.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'superadmin' CHECK (role IN ('superadmin', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_login_at TIMESTAMPTZ
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    description TEXT,
    craftsmanship TEXT,
    materials JSONB DEFAULT '[]'::jsonb,
    dimensions TEXT,
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    variants JSONB NOT NULL DEFAULT '{"types": [], "combinations": []}'::jsonb,
    base_price_kobo BIGINT NOT NULL,
    discount JSONB,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    featured BOOLEAN NOT NULL DEFAULT false,
    specifications JSONB DEFAULT '{}'::jsonb,
    rating NUMERIC(3,2) DEFAULT 4.90,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal_kobo BIGINT NOT NULL,
    discount_kobo BIGINT NOT NULL DEFAULT 0,
    shipping_kobo BIGINT NOT NULL DEFAULT 0,
    total_kobo BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled')),
    shipping_address JSONB NOT NULL,
    delivery_method TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    admin_username TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT
);

-- 6. SITE TRAFFIC / ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.site_traffic (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    date DATE NOT NULL DEFAULT CURRENT_DATE UNIQUE,
    visitors INTEGER NOT NULL DEFAULT 0,
    page_views INTEGER NOT NULL DEFAULT 0,
    top_pages JSONB DEFAULT '[]'::jsonb
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_traffic ENABLE ROW LEVEL SECURITY;

-- Allow public read of published products
DROP POLICY IF EXISTS "Public can view published products" ON public.products;
CREATE POLICY "Public can view published products"
ON public.products FOR SELECT
USING (status = 'published');

-- Allow service role and anon server API to manage products
DROP POLICY IF EXISTS "Allow anon full products access" ON public.products;
CREATE POLICY "Allow anon full products access"
ON public.products FOR ALL
USING (true)
WITH CHECK (true);

-- Allow public checkout order insertion
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Allow backend full access to orders
DROP POLICY IF EXISTS "Backend full access to orders" ON public.orders;
CREATE POLICY "Backend full access to orders"
ON public.orders FOR ALL
USING (true)
WITH CHECK (true);

-- Allow backend full access to audit logs
DROP POLICY IF EXISTS "Backend full access to audit logs" ON public.audit_logs;
CREATE POLICY "Backend full access to audit logs"
ON public.audit_logs FOR ALL
USING (true)
WITH CHECK (true);

-- Allow backend full access to site traffic
DROP POLICY IF EXISTS "Backend full access to site traffic" ON public.site_traffic;
CREATE POLICY "Backend full access to site traffic"
ON public.site_traffic FOR ALL
USING (true)
WITH CHECK (true);

-- Allow backend access to admins
DROP POLICY IF EXISTS "Backend access to admins" ON public.admins;
CREATE POLICY "Backend access to admins"
ON public.admins FOR ALL
USING (true)
WITH CHECK (true);

-- 9. SEED INITIAL SUPERADMIN (declareola)
-- Password hashes for both "arieb26a-a13fde053ca9?" and "arieb26a-a13fde053ca9"
INSERT INTO public.admins (id, username, password_hash, role)
VALUES (
    'admin_declareola_01',
    'declareola',
    '$2b$12$MFZQAzDXRzq7JTrJUY.xNekMpwNN/KaWdhQCKPjmFgUV0p2Q3Bj2G',
    'superadmin'
)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    updated_at = timezone('utc'::text, now());
