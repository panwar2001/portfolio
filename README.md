# Ayush Panwar — Portfolio

A server-rendered portfolio for **Ayush Panwar**, app developer
([Play Store profile](https://play.google.com/store/apps/dev?id=4944030915077582132)).

It is deliberately platform-agnostic: an **Android app, an iOS app and a web app
are all just rows in the same table**, and the same card, grid and detail page
render them. Play Store and App Store badges are chosen from the row's
`platform` column, so adding an App Store link needs no code change.

Built with **React Router v8 framework mode** on **Cloudflare Workers**, with all
content served from **Cloudflare D1**. The layout follows
[garoono.in](https://garoono.in/): a persistent identity sidebar (avatar, name,
location, audience count, tagline, newsletter, socials), then a main column with

1. a short headline,
2. an **Apps** shelf,
3. a **Web apps** shelf (off by default — see `siteConfig.showWebApps`),
4. the stat strip and a one-line footer.

The shelf hides itself unless `platform = 'web'` rows exist, and is additionally
gated by `app/lib/config.ts`:

```ts
export const siteConfig = { showWebApps: false };
```

Flip that to `true` (and add a web row) to bring the section back — the
component, the detail page at `/apps/:slug`, the store badges and the schema all
already support it, so nothing else needs to change.

One light theme, no theme switch. `/apps/:slug` holds the per-app detail page
(screenshots, full description, store links), `/about` redirects home, and
`/status` reports the live data source.

---

## Stack

| Concern    | Choice                                                       |
| ---------- | ------------------------------------------------------------ |
| Framework  | React Router `8.3.1` (framework mode, SSR)                    |
| Runtime    | Cloudflare Workers via `@cloudflare/vite-plugin`              |
| Database   | Cloudflare D1 (SQLite) — `DB` binding                         |
| Styling    | Tailwind CSS v4 + a small set of CSS variables/classes        |
| Build      | Vite 8                                                        |
| Icons/font | Inline SVG icons, Fraunces + Inter from Google Fonts          |

React Router v8 changes that matter here:

- `react-router-dom` is gone — everything imports from `react-router`.
- Loaders always receive a **`RouterContextProvider`**, so Worker bindings are
  passed through `createContext` (`app/lib/cloudflare.server.ts`) and read with
  `context.get(cloudflareContext)`. See `workers/app.ts`.

---

## Mock first, then D1

There is exactly one read path — `app/lib/portfolio.server.ts`:

```
DATA_SOURCE=mock  ─────────────► app/lib/mock-data.ts        (offline fixture)
DATA_SOURCE=d1    ──► D1 query ─┬─► D1 rows                   (production)
                               └─► mock-data.ts              (automatic fallback)
```

The fallback triggers when:

- the `DB` binding is missing, or
- the tables have not been migrated yet, or
- any D1 query throws.

When it triggers, the page still renders (with a small banner explaining why)
and the footer shows **Data: local mock** instead of **Data: Cloudflare D1**.
`/status` shows the active source and the exact commands to attach D1.

The fixtures in `app/lib/mock-data.ts` are the single source of truth:
`npm run seed:generate` compiles them into `db/seed.sql`, so mock mode and D1
mode render identical pages.

---

## Local development

```bash
npm install
npm run db:setup:local   # migrations + seed against the local D1 emulation
npm run dev              # http://localhost:5173
```

`npm run dev` runs your server code inside the Workers runtime (workerd) with a
local D1 database stored in `.wrangler/state`. Useful scripts:

| Script                            | What it does                                    |
| --------------------------------- | ----------------------------------------------- |
| `npm run build`                   | Production build (client + server + Worker)     |
| `npm run preview`                 | Build, then preview through Vite + workerd      |
| `npm run typecheck`               | `wrangler types` + `react-router typegen` + tsc |
| `npm run seed:generate`           | Regenerate `db/seed.sql` from the fixtures       |
| `npm run sync:apps`               | Re-scrape Play Store numbers into the fixtures    |
| `npm run sync:apps -- --write-d1` | …and apply them to the local D1 database          |
| `npm run db:migrate:local`        | Apply `db/migrations/*.sql` locally              |
| `npm run db:seed:local`           | Load `db/seed.sql` locally                       |
| `npm run db:setup:local`          | Both of the above                                |

To work offline on the design only, create `.dev.vars` with
`DATA_SOURCE=mock` (see `.dev.vars.example`).

---

## Refreshing install counts

Install counts are **static rows**, not runtime fetches: the site reads whatever
is in `products.installs_label` / `min_installs` (or the fixture). Play has no
official API, so a script scrapes the public listing and writes the new numbers
into the single source of truth:

```bash
npm run sync:apps                  # update app/lib/mock-data.ts + db/seed.sql
npm run sync:apps -- --write-d1    # ...and apply to the local D1 database
npm run db:seed:remote             # push to production D1
```

It refreshes, per Android app: `installsLabel`, `minInstalls`, `version`,
`updatedAt`, and `score`/`ratings` when the store reports them. Anything it
cannot verify is left untouched, every change is printed, and it tells you when
nothing changed. iOS rows are never modified — Apple publishes no download
counts, so those stay hand-entered.

For a hands-off setup, add a Cloudflare cron trigger that runs the same scrape
and `UPDATE`s the rows; nothing else in the app needs to change.

## Deploying to Cloudflare

```bash
# 1. Create the database and copy the printed database_id into wrangler.jsonc
npm run db:create

# 2. Create the tables and load the content (remote)
npm run db:setup:remote

# 3. Build and deploy the Worker
npm run deploy
```

`wrangler.jsonc` already contains the binding:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "portfolio_db",
    "database_id": "REPLACE_WITH_YOUR_D1_DATABASE_ID",
    "migrations_dir": "db/migrations"
  }
]
```

Deploying from Cloudflare Workers Builds? Set the build command to
`npm run build` and the deploy command to `npx wrangler deploy` (the
`deploy` script already builds, so either works).

### Editing content

Everything is a SQL row — no redeploy needed. `platform` is
`'android' | 'ios' | 'web'`, and `store_url` is the primary button target:

```bash
# add an iOS app (App Store badge + "App Store" button appear automatically)
npx wrangler d1 execute portfolio_db --remote --command \
  "INSERT INTO products (slug, title, tagline, description, platform, store_url, installs_label, min_installs, genre, sort_order)
   VALUES ('my-ios-app', 'My iOS App', 'One-line pitch.', 'Long description.', 'ios', 'https://apps.apple.com/app/id123456', '1K+', 1000, 'Productivity', 5)"

# add a web app (lands in the "Web apps" tab)
npx wrangler d1 execute portfolio_db --remote --command \
  "INSERT INTO products (slug, title, tagline, description, platform, store_url, sort_order)
   VALUES ('my-web-app', 'My Web App', 'One-line pitch.', 'Long description.', 'web', 'https://app.example.com', 6)"

# update the audience number on an app
npx wrangler d1 execute portfolio_db --remote --command \
  "UPDATE products SET installs_label='1,000+', min_installs=1000 WHERE slug='pdf-to-text-ai'"

# fix a social link
npx wrangler d1 execute portfolio_db --remote --command \
  "UPDATE socials SET url='https://github.com/<you>' WHERE icon='github'"
```

Extra buttons per product live in `product_links` (`kind` is
`play | appstore | website | privacy | other`, which picks the icon).

---

## Routes

| Path                | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `/`                 | Headline, Apps shelf, Web apps shelf, stat strip            |
| `/apps/:slug`       | Screenshots, full description, store link, more apps          |
| `/about`            | 301 redirect to `/`                                            |
| `/status`           | Which data source is live + D1 setup checklist                |
| `/newsletter`       | Resource route (POST) writing to the `subscribers` table      |
| `/subscribers`      | Resource route (GET) returning `{ count, available }` for the sidebar |
| `/sitemap.xml`      | Generated from the same D1 rows                               |
| `/projects`, `/projects/:slug` | 301 redirects to the home page / `/apps/:slug`     |

## Schema (`db/migrations/`)

| Table                 | Contents                                                    |
| --------------------- | ----------------------------------------------------------- |
| `profile`             | Single row: name, headline, tagline, bio, contact            |
| `stats`               | KPI strip entries                                            |
| `socials`             | Sidebar links (icon keys map to `app/components/icons.tsx`)  |
| `experience`          | Timeline entries                                             |
| `products`            | Every product; `platform` = `android` / `ios` / `web`        |
| `product_links`       | Extra buttons per product (`kind` selects the store icon)    |
| `product_screenshots` | Detail-page screenshot rail                                  |
| `subscribers`         | Newsletter signups                                           |

`0001_init.sql` creates the current schema; `0002_platform.sql` upgrades a
database made from the earlier Android-only schema.

The sidebar renders identity from `profile`, the experience timeline reads
`experience` (role, company, period, `is_current` for the accent dot), and the
"Follow the journey" block reads and writes `subscribers`:

- the form POSTs to `/newsletter`, which inserts into `subscribers`
  (`INSERT … ON CONFLICT(email) DO NOTHING`, so re-submitting is a no-op)
- the "N people following along" line GETs `/subscribers`, a resource route
  running `SELECT COUNT(*) FROM subscribers`
- after a successful submit the count is re-read, so the number moves without a
  page reload — and it is never stored twice, D1 is always the source

---

## Before you publish

The layout is final, but a few rows are obviously placeholders — replace them
with your real details:

1. **`socials`** — the GitHub, LinkedIn and email entries currently point at
   `github.com/ayushpanwar`, `linkedin.com/in/ayushpanwar` and
   `hello@example.com`. Update them (see the SQL above) or edit them in
   `app/lib/mock-data.ts` and re-run `npm run seed:generate`.
2. **`experience`** — already set to Accenture (Sep 2024 – Present) and Tally
   Solutions (Oct 2023 – Jan 2024). Add earlier roles with an INSERT.
3. **`profile.avatar_url`** — currently empty, so the sidebar shows an “AP”
   monogram. Set it to a square photo URL (or drop a file in `public/`).
4. **`profile.stats`** — the KPI numbers come from the store data (5 apps,
   570+ installs, 3 platforms). Adjust the framing in the `stats` table.
5. **Placeholder products** — `starter-ios-app` and `weather-web` exist to prove
   the iOS and web paths end to end. Delete them and add your real links.
6. **`wrangler.jsonc`** — replace `REPLACE_WITH_YOUR_D1_DATABASE_ID`
   after `npm run db:create`.

App descriptions, icons and screenshots were read from your public Play Store
listings, so those are accurate as of the scrape.

---

## Project layout

```
app/
  app.css                     design tokens + reusable classes
  root.tsx                    document shell, fonts, theme boot, error boundary
  routes.ts                   route config
  components/                 sidebar, cards, grid, stats, newsletter, icons
  lib/
    types.ts                  domain types + platform/store helpers
    mock-data.ts              offline fixture (source of truth for the seed)
    db.ts                     row → domain mapping
    cloudflare.server.ts      Worker bindings ↔ loaders context bridge
    portfolio.server.ts       the only read path (D1 with mock fallback)
  routes/
    app.tsx                   layout route: loads the portfolio once
    home.tsx  app-detail.tsx  about.tsx  status.tsx
    projects.tsx  project-detail.tsx    (301 redirects)
    newsletter.ts  sitemap.ts
db/
  migrations/0001_init.sql    schema
  migrations/0002_platform.sql upgrade from the Android-only schema
  seed.sql                    generated from app/lib/mock-data.ts
scripts/generate-seed.ts      fixture → SQL generator
workers/app.ts                Worker entry (RouterContextProvider + bindings)
```
