import type { LinkKind, Platform, Product } from "~/lib/types";

/** A product row exactly as it is stored in D1 (snake_case, no joins). */
export interface ProductRow {
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  platform: string | null;
  store_url: string | null;
  installs_label: string | null;
  min_installs: number | null;
  score: number | null;
  ratings: number | null;
  reviews: number | null;
  genre: string | null;
  released_at: string | null;
  updated_at: string | null;
  version: string | null;
  ad_supported: number | null;
  offers_iap: number | null;
  size_label: string | null;
  icon_url: string | null;
  header_image_url: string | null;
  primary_url: string | null;
  accent_color: string | null;
  featured: number | null;
  sort_order: number | null;
  /** Present only on databases created before migration 0002. */
  type?: string | null;
}

export interface LinkRow {
  product_slug: string;
  label: string;
  url: string;
  kind: string | null;
  sort_order: number | null;
}

export interface ScreenshotRow {
  product_slug: string;
  url: string;
  sort_order: number | null;
}

export interface ExperienceRow {
  role: string;
  company: string;
  period: string;
  summary: string | null;
  location: string | null;
  is_current: number | null;
  sort_order: number | null;
}

export interface ProfileRow {
  id: number;
  name: string;
  headline: string;
  role: string;
  tagline: string;
  location: string;
  avatar_url: string | null;
  bio: string;
  email: string | null;
  availability: string | null;
}

export interface StatRow {
  label: string;
  value: string;
  sort_order: number | null;
}

export interface SocialRow {
  label: string;
  url: string;
  icon: string | null;
  sort_order: number | null;
}

const PLATFORMS: Platform[] = ["android", "ios", "web"];
const LINK_KINDS: LinkKind[] = ["play", "appstore", "website", "privacy", "other"];

function toPlatform(row: ProductRow): Platform {
  const raw = (row.platform ?? row.type ?? "android").toLowerCase();
  return (PLATFORMS as string[]).includes(raw) ? (raw as Platform) : "android";
}

function toLinkKind(raw: string | null): LinkKind {
  const value = (raw ?? "other").toLowerCase();
  return (LINK_KINDS as string[]).includes(value) ? (value as LinkKind) : "other";
}

/** Convert a flat D1 row + its children into the domain `Product`. */
export function rowToProduct(
  row: ProductRow,
  links: LinkRow[] = [],
  screenshots: ScreenshotRow[] = [],
): Product {
  return {
    slug: row.slug,
    title: row.title,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    platform: toPlatform(row),
    storeUrl: row.store_url ?? row.primary_url ?? null,
    installsLabel: row.installs_label ?? "",
    minInstalls: row.min_installs ?? 0,
    score: row.score ?? null,
    ratings: row.ratings ?? 0,
    reviews: row.reviews ?? 0,
    genre: row.genre ?? "",
    releasedAt: row.released_at ?? null,
    updatedAt: row.updated_at ?? null,
    version: row.version ?? null,
    adSupported: Boolean(row.ad_supported),
    offersIap: Boolean(row.offers_iap),
    sizeLabel: row.size_label ?? null,
    iconUrl: row.icon_url ?? null,
    headerImageUrl: row.header_image_url ?? null,
    accentColor: row.accent_color ?? "#b45309",
    featured: Boolean(row.featured),
    sortOrder: row.sort_order ?? 100,
    links: [...links]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((link) => ({
        label: link.label,
        url: link.url,
        kind: toLinkKind(link.kind),
      })),
    screenshots: [...screenshots]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((s) => s.url),
  };
}
