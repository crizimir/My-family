# Base44 Dev Environment

## Project Overview
React + Vite + TypeScript single-page app ("The Cuares Family Space") — a family sanctuary
with timeline, photo album, routines, goals, finances, and social feed. Uses Supabase
for data persistence (PostgREST-compatible API). Password-gated frontend (no Supabase auth).

## Architecture
- **Frontend**: Vite dev server on port 3000 (React 19, Tailwind v4, react-router HashRouter)
- **API**: Local PostgREST (v12) providing a Supabase-compatible REST API
- **Database**: PostgreSQL 16 with the migration from `supabase/migrations/`
- **Single-origin**: Vite proxies `/rest/v1/` → PostgREST, stripping Supabase auth headers
  (PostgREST has no JWT secret; the proxy removes `Authorization`/`apikey` headers)

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
- Web entry: http://localhost:3000
- Health check: `curl -s http://localhost:3000` → 200

## Key Files
- `docker-compose.base44.yml` — compose stack (db, postgrest, web)
- `docker/init.sql` — Postgres init: roles (anon, authenticated, authenticator) + migration + grants
- `.env.base44-defaults` — dev placeholder for `VITE_SUPABASE_ANON_KEY`
- `vite.config.ts` — Vite proxy config (`/rest/v1` → PostgREST, `allowedHosts: true`)
- `src/utils/supabaseClient.ts` — falls back to `window.location.origin` when `VITE_SUPABASE_URL` unset

## Using a Cloud Supabase Instead
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` via the Base44 secrets dashboard.
These override the local defaults. The Vite proxy is only used when `VITE_SUPABASE_URL`
is unset (local dev mode).

## App Quirks
- Login password: `mirwenjanineforever` (stored in localStorage as `cuares_sanctuary_auth_v1`)
- App gracefully falls back to in-memory default data if Supabase is unreachable
- `DISABLE_HMR=true` env var disables HMR and file watching (for agent edits)
- Uses `bun.lock` and `package-lock.json`; npm is used in the container
