import { getCloudflareEnv } from "~/lib/cloudflare.server";
import {
  rowToProduct,
  type ExperienceRow,
  type LinkRow,
  type ProductRow,
  type ProfileRow,
  type ScreenshotRow,
  type SocialRow,
  type StatRow,
} from "~/lib/db";
import { mockExperience, mockProducts, mockProfile } from "~/lib/mock-data";
import type {
  DataSource,
  ExperienceItem,
  PortfolioData,
  Product,
  Profile,
  SocialLink,
} from "~/lib/types";

/**
 * The single read path for portfolio content.
 *
 *   1. If DATA_SOURCE="mock" → the offline fixture (app/lib/mock-data.ts).
 *   2. Otherwise try D1. If the binding is missing, a table does not exist, or
 *      a query throws → fall back to the fixture and report why in `notice`.
 *
 * A fresh clone therefore renders immediately, and production upgrades to the
 * database the moment `wrangler d1 migrations apply` + the seed have run.
 */

const MOCK: PortfolioData = {
  profile: mockProfile,
  experience: mockExperience,
  products: mockProducts,
  source: "mock",
  notice: null,
};

export interface SiteData extends PortfolioData {
  /** Products that are not web apps (Android + iOS). */
  apps: Product[];
  /** Browser-based products. */
  web: Product[];
  featured: Product[];
}

function mockSiteData(reason: string | null = null): SiteData {
  return decorate({ ...MOCK, notice: reason });
}

function decorate(data: PortfolioData): SiteData {
  const products = [...data.products].sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    ...data,
    products,
    apps: products.filter((p) => p.platform !== "web"),
    web: products.filter((p) => p.platform === "web"),
    featured: products.filter((p) => p.featured),
  };
}

function isMissingTable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /no such table|does not exist|no such column/i.test(message);
}

/**
 * Read the whole portfolio from D1.
 * Throws when the database is unusable so callers can fall back uniformly.
 */
async function loadFromD1(db: D1Database): Promise<PortfolioData> {
  const [profileRes, statsRes, socialsRes, experienceRes, productsRes, linksRes, shotsRes] =
    await Promise.all([
      db.prepare("SELECT * FROM profile WHERE id = 1").first<ProfileRow>(),
      db.prepare("SELECT * FROM stats ORDER BY sort_order").all<StatRow>(),
      db.prepare("SELECT * FROM socials ORDER BY sort_order").all<SocialRow>(),
      db.prepare("SELECT * FROM experience ORDER BY sort_order").all<ExperienceRow>(),
      db
        .prepare(
          `SELECT slug, title, tagline, description, platform, store_url,
                  installs_label, min_installs, score, ratings, reviews, genre,
                  released_at, updated_at, version, size_label, icon_url,
                  header_image_url, accent_color, featured, sort_order
             FROM products
            ORDER BY sort_order, title`,
        )
        .all<ProductRow>(),
      db
        .prepare(
          "SELECT product_slug, label, url, kind, sort_order FROM product_links ORDER BY product_slug, sort_order",
        )
        .all<LinkRow>(),
      db
        .prepare("SELECT * FROM product_screenshots ORDER BY product_slug, sort_order")
        .all<ScreenshotRow>(),
    ]);

  if (!profileRes) {
    throw new Error("profile table is empty");
  }

  const linksBySlug = new Map<string, LinkRow[]>();
  for (const link of linksRes.results ?? []) {
    const list = linksBySlug.get(link.product_slug) ?? [];
    list.push(link);
    linksBySlug.set(link.product_slug, list);
  }

  const shotsBySlug = new Map<string, ScreenshotRow[]>();
  for (const shot of shotsRes.results ?? []) {
    const list = shotsBySlug.get(shot.product_slug) ?? [];
    list.push(shot);
    shotsBySlug.set(shot.product_slug, list);
  }

  const socials: SocialLink[] = (socialsRes.results ?? []).map((row) => ({
    label: row.label,
    url: row.url,
    icon: (row.icon ?? "globe") as SocialLink["icon"],
  }));

  const profile: Profile = {
    name: profileRes.name,
    headline: profileRes.headline,
    role: profileRes.role,
    tagline: profileRes.tagline,
    location: profileRes.location,
    avatarUrl: profileRes.avatar_url,
    bio: profileRes.bio,
    email: profileRes.email,
    availability: profileRes.availability,
    stats: (statsRes.results ?? []).map((row) => ({
      label: row.label,
      value: row.value,
    })),
    // Never let a half-seeded socials table empty the sidebar.
    socials: socials.length ? socials : mockProfile.socials,
  };

  const experience: ExperienceItem[] = (experienceRes.results ?? []).map((row) => ({
    role: row.role,
    company: row.company,
    period: row.period,
    summary: row.summary,
    location: row.location,
    current: Boolean(row.is_current),
    sortOrder: row.sort_order ?? 0,
  }));

  const products: Product[] = (productsRes.results ?? []).map((row) =>
    rowToProduct(row, linksBySlug.get(row.slug), shotsBySlug.get(row.slug)),
  );

  return { profile, experience, products, source: "d1", notice: null };
}

/**
 * Main entry point used by every loader.
 * `context` is the React Router v8 `RouterContextProvider`.
 */
export async function getSiteData(context: unknown): Promise<SiteData> {
  const env = getCloudflareEnv(context);
  const forced = env?.DATA_SOURCE?.toLowerCase();

  if (forced === "mock") {
    return mockSiteData("DATA_SOURCE=mock — serving the bundled fixture.");
  }

  if (!env?.DB) {
    return mockSiteData(
      "D1 binding `DB` is not attached — serving the bundled fixture.",
    );
  }

  try {
    return decorate(await loadFromD1(env.DB));
  } catch (error) {
    const reason = isMissingTable(error)
      ? "D1 is attached but not migrated — run `npm run db:migrate:local && npm run db:seed:local`."
      : `D1 read failed (${error instanceof Error ? error.message : String(error)}) — serving the bundled fixture.`;
    console.warn("[portfolio] falling back to mock data:", reason);
    return mockSiteData(reason);
  }
}

/** Single product lookup by slug, from whichever source is live. */
export async function getProduct(
  context: unknown,
  slug: string,
): Promise<{ product: Product; source: DataSource } | null> {
  const data = await getSiteData(context);
  const product = data.products.find((p) => p.slug === slug);
  return product ? { product, source: data.source } : null;
}

/**
 * Newsletter signup — only possible with a live D1 binding.
 * Returns a discriminated result the action can render directly.
 */
export async function subscribeEmail(
  context: unknown,
  email: string,
  source = "home",
): Promise<{ ok: true; duplicate: boolean } | { ok: false; error: string }> {
  const env = getCloudflareEnv(context);
  if (!env?.DB) {
    return {
      ok: false,
      error: "The newsletter needs the D1 binding — attach `DB` and migrate.",
    };
  }

  try {
    const result = await env.DB.prepare(
      "INSERT INTO subscribers (email, source) VALUES (?, ?) ON CONFLICT(email) DO NOTHING",
    )
      .bind(email, source)
      .run();
    const changes = Number(
      (result.meta as { changes?: number } | undefined)?.changes ?? 0,
    );
    return { ok: true, duplicate: changes === 0 };
  } catch (error) {
    if (isMissingTable(error)) {
      return {
        ok: false,
        error: "The `subscribers` table is missing — run the migrations first.",
      };
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save that email.",
    };
  }
}
