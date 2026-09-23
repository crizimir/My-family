/*
# Family Sanctuary — Persistent Data Storage

## Purpose
Migrates the Cuares Family Sanctuary app from browser localStorage to permanent
Supabase database storage. Every change (photos, audio, text, finances, etc.)
is now saved to the database and visible to all visitors across all devices.

## Approach
Single-tenant: the app has a login password gate (mirwenjanineforever) but no
Supabase auth accounts. All data is shared/public, so policies use
TO anon, authenticated with USING (true).

## New Tables

1. `sanctuary_settings` — single row with site settings (family name, tagline, etc.)
   - `id` int PK (always 1, singleton)
   - `data` jsonb — the SiteSettings object
   - `hero_photo` text — hero cover image URL or data URL
   - `updated_at` timestamptz

2. `sanctuary_data` — key/value store for all array-based app state
   - `key` text PK — e.g. 'profiles', 'tracks', 'photos', 'finances', etc.
   - `value` jsonb — the array/object for that key
   - `updated_at` timestamptz

## Security
- RLS enabled on both tables.
- All CRUD allowed for anon + authenticated (single-tenant, password-gated app).
- USING (true) is intentional: the data is shared and the app gate is the login password.
*/

CREATE TABLE IF NOT EXISTS sanctuary_settings (
  id int PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero_photo text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_settings CHECK (id = 1)
);

ALTER TABLE sanctuary_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_settings" ON sanctuary_settings;
CREATE POLICY "anon_select_settings" ON sanctuary_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_settings" ON sanctuary_settings;
CREATE POLICY "anon_insert_settings" ON sanctuary_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_settings" ON sanctuary_settings;
CREATE POLICY "anon_update_settings" ON sanctuary_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_settings" ON sanctuary_settings;
CREATE POLICY "anon_delete_settings" ON sanctuary_settings FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS sanctuary_data (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sanctuary_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_data" ON sanctuary_data;
CREATE POLICY "anon_select_data" ON sanctuary_data FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_data" ON sanctuary_data;
CREATE POLICY "anon_insert_data" ON sanctuary_data FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_data" ON sanctuary_data;
CREATE POLICY "anon_update_data" ON sanctuary_data FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_data" ON sanctuary_data;
CREATE POLICY "anon_delete_data" ON sanctuary_data FOR DELETE
  TO anon, authenticated USING (true);
