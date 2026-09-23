-- PostgREST roles
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator LOGIN PASSWORD 'postgrest_auth';
  END IF;
END $$;
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;

-- ============ Migration: create_family_sanctuary_tables ============

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

-- ============ Grants for PostgREST anon role ============

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON sanctuary_settings, sanctuary_data TO anon;
