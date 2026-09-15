/**
 * Domain types for the portfolio.
 *
 * These mirror the D1 schema in `db/migrations/*.sql`. Everything the site
 * renders comes from these shapes, whether the bytes originate from the mock
 * fixture (`app/lib/mock-data.ts`) or from the D1 database.
 *
 * Products are deliberately platform-agnostic: an Android app, an iOS app and
 * a web app are all just products with a different `platform` (and the same
 * card, grid and detail page render them).
 */

export type Platform = "android" | "ios" | "web";

/** A shipped product: app store app, web app, or anything else with a link. */
export interface Product {
  /** URL-safe identifier, used as `/apps/:slug`. */
  slug: string;
  title: string;
  /** Short line shown on cards. Empty string is allowed. */
  tagline: string;
  /** Full store / product description. */
  description: string;
  platform: Platform;
  /** Which store or site the primary CTA points at. */
  storeUrl: string | null;
  /** Optional per-platform audience count, e.g. `500+` or `12K+`. */
  installsLabel: string;
  /** Numeric audience count, used for the sidebar total. */
  minInstalls: number;
  score: number | null;
  ratings: number;
  reviews: number;
  genre: string;
  releasedAt: string | null;
  updatedAt: string | null;
  version: string | null;
  /** Store-listing flags (Android today; harmless for other platforms). */
  adSupported?: boolean;
  offersIap?: boolean;
  sizeLabel: string | null;
  iconUrl: string | null;
  headerImageUrl: string | null;
  accentColor: string;
  featured: boolean;
  sortOrder: number;
  /** Secondary outbound links (a second store, website, privacy policy…). */
  links: ProductLink[];
  screenshots: string[];
}

export type LinkKind = "play" | "appstore" | "website" | "privacy" | "other";

export interface ProductLink {
  label: string;
  url: string;
  kind: LinkKind;
}

/** A work-experience entry on the sidebar timeline. */
export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  summary: string | null;
  location: string | null;
  current: boolean;
  sortOrder: number;
}

export interface ProfileStat {
  label: string;
  value: string;
}

export interface SocialLink {
  label: string;
  url: string;
  /** Icon key resolved in `app/components/icons.tsx`. */
  icon:
    | "play"
    | "appstore"
    | "github"
    | "linkedin"
    | "x"
    | "leetcode"
    | "mail"
    | "globe"
    | "youtube"
    | "instagram";
}

export interface Profile {
  name: string;
  headline: string;
  role: string;
  tagline: string;
  location: string;
  avatarUrl: string | null;
  bio: string;
  email: string | null;
  availability: string | null;
  stats: ProfileStat[];
  socials: SocialLink[];
}

/** Where the data actually came from — surfaced in the footer. */
export type DataSource = "d1" | "mock";

export interface PortfolioData {
  profile: Profile;
  experience: ExperienceItem[];
  products: Product[];
  source: DataSource;
  /** Populated instead of throwing when D1 is unreachable or unmigrated. */
  notice: string | null;
}

/* -------------------------------------------------------------- helpers */

const formatCount = (value: number) =>
  value >= 1000 ? `${Math.round(value / 100) / 10}k` : String(value);

/** Sum of app-store installs across mobile products, e.g. `570+`. */
export function totalInstallsLabel(products: Product[]): string {
  const mobile = products.filter((p) => p.platform !== "web");
  const min = mobile.reduce((sum, p) => sum + p.minInstalls, 0);
  if (!min) return "New";
  return `${formatCount(min)}+`;
}

/** `500+ installs`, or `New` when there is nothing to report yet. */
export function audienceLabel(product: Product): string | null {
  if (!product.installsLabel || product.installsLabel === "New") return null;
  return `${product.installsLabel} installs`;
}

export const platformLabel: Record<Platform, string> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
};

export const storeLabel: Record<Platform, string> = {
  android: "Google Play",
  ios: "App Store",
  web: "Live app",
};

export function mobileProducts(products: Product[]): Product[] {
  return products.filter((p) => p.platform !== "web");
}

export function webProducts(products: Product[]): Product[] {
  return products.filter((p) => p.platform === "web");
}

/** `Feb 12, 2024` from an ISO date, or null. Rendered in UTC so SSR and the
 *  client always agree (avoids hydration mismatches). */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
