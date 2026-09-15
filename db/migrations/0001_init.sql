-- Portfolio schema for Cloudflare D1 (SQLite).
--
-- Everything the site renders lives in these tables, so content edits are
-- plain SQL INSERT/UPDATE statements — no redeploy needed.

CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  headline TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  bio TEXT NOT NULL DEFAULT '',
  email TEXT,
  availability TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS socials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'globe',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experience (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  summary TEXT,
  location TEXT,
  is_current INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Products are platform-agnostic: an Android app, an iOS app or a web app are
-- all rows here, differing only by `platform`.
--
--   platform = 'android' | 'ios' | 'web'
--
-- `store_url` is the primary call to action (Play Store / App Store / live
-- site); `product_links` holds any extra buttons.
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  platform TEXT NOT NULL DEFAULT 'android'
    CHECK (platform IN ('android', 'ios', 'web')),
  store_url TEXT,
  installs_label TEXT NOT NULL DEFAULT '',
  min_installs INTEGER NOT NULL DEFAULT 0,
  score REAL,
  ratings INTEGER NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  genre TEXT NOT NULL DEFAULT '',
  released_at TEXT,
  updated_at TEXT,
  version TEXT,
  ad_supported INTEGER NOT NULL DEFAULT 0,
  offers_iap INTEGER NOT NULL DEFAULT 0,
  size_label TEXT,
  icon_url TEXT,
  header_image_url TEXT,
  accent_color TEXT NOT NULL DEFAULT '#b45309',
  featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- kind tells the UI which icon/label to use:
-- 'play' | 'appstore' | 'website' | 'privacy' | 'other'
CREATE TABLE IF NOT EXISTS product_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_slug TEXT NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'other',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_screenshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_slug TEXT NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Newsletter signups collected by the sidebar / home form.
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  source TEXT NOT NULL DEFAULT 'home'
);

CREATE INDEX IF NOT EXISTS idx_products_platform ON products(platform);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_links_slug ON product_links(product_slug);
CREATE INDEX IF NOT EXISTS idx_shots_slug ON product_screenshots(product_slug);
CREATE INDEX IF NOT EXISTS idx_experience_sort ON experience(sort_order);
