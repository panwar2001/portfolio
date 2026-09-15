/**
 * Generates `db/seed.sql` from the TypeScript fixtures in `app/lib/mock-data.ts`.
 *
 * Usage:  node --experimental-strip-types scripts/generate-seed.ts
 *   (or)  npm run seed:generate
 *
 * Keeping one source of truth means "mock mode" and "D1 mode" render exactly
 * the same portfolio — you only ever edit the fixtures (or the D1 tables).
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { mockExperience, mockProducts, mockProfile } from "../app/lib/mock-data.ts";

const here = dirname(fileURLToPath(import.meta.url));

/** Quote a value for SQLite: single quotes doubled, NULL for null/undefined. */
function sql(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  return `'${String(value).replace(/'/g, "''")}'`;
}

const lines: string[] = [];

lines.push("-- GENERATED FILE — do not edit by hand.");
lines.push("-- Source: app/lib/mock-data.ts  ·  Regenerate: npm run seed:generate");
lines.push("-- Applies to both `wrangler d1 execute --local` and `--remote`.");
lines.push("");
lines.push("DELETE FROM product_screenshots;");
lines.push("DELETE FROM product_links;");
lines.push("DELETE FROM products;");
lines.push("DELETE FROM experience;");
lines.push("DELETE FROM stats;");
lines.push("DELETE FROM socials;");
lines.push("DELETE FROM profile;");
lines.push("");

// ---------------------------------------------------------------- profile
lines.push("INSERT INTO profile (id, name, headline, role, tagline, location, avatar_url, bio, email, availability) VALUES");
lines.push(
  `  (1, ${sql(mockProfile.name)}, ${sql(mockProfile.headline)}, ${sql(mockProfile.role)}, ${sql(
    mockProfile.tagline,
  )}, ${sql(mockProfile.location)}, ${sql(mockProfile.avatarUrl)}, ${sql(mockProfile.bio)}, ${sql(
    mockProfile.email,
  )}, ${sql(mockProfile.availability)});`,
);
lines.push("");

// ------------------------------------------------------------------ stats
if (mockProfile.stats.length) {
  lines.push("INSERT INTO stats (label, value, sort_order) VALUES");
  lines.push(
    mockProfile.stats
      .map((stat, i) => `  (${sql(stat.label)}, ${sql(stat.value)}, ${i + 1})`)
      .join(",\n") + ";",
  );
  lines.push("");
}

// ---------------------------------------------------------------- socials
if (mockProfile.socials.length) {
  lines.push("INSERT INTO socials (label, url, icon, sort_order) VALUES");
  lines.push(
    mockProfile.socials
      .map(
        (social, i) =>
          `  (${sql(social.label)}, ${sql(social.url)}, ${sql(social.icon)}, ${i + 1})`,
      )
      .join(",\n") + ";",
  );
  lines.push("");
}

// ------------------------------------------------------------- experience
if (mockExperience.length) {
  lines.push(
    "INSERT INTO experience (role, company, period, summary, location, is_current, sort_order) VALUES",
  );
  lines.push(
    mockExperience
      .map(
        (job) =>
          `  (${sql(job.role)}, ${sql(job.company)}, ${sql(job.period)}, ${sql(job.summary)}, ${sql(
            job.location,
          )}, ${sql(job.current)}, ${job.sortOrder})`,
      )
      .join(",\n") + ";",
  );
  lines.push("");
}

// --------------------------------------------------------------- products
const productColumns = [
  "slug",
  "title",
  "tagline",
  "description",
  "platform",
  "store_url",
  "installs_label",
  "min_installs",
  "score",
  "ratings",
  "reviews",
  "genre",
  "released_at",
  "updated_at",
  "version",
  "ad_supported",
  "offers_iap",
  "size_label",
  "icon_url",
  "header_image_url",
  "accent_color",
  "featured",
  "sort_order",
];

if (mockProducts.length) {
  lines.push(`INSERT INTO products (${productColumns.join(", ")}) VALUES`);
  lines.push(
    mockProducts
      .map((p) =>
        [
          p.slug,
          p.title,
          p.tagline,
          p.description,
          p.platform,
          p.storeUrl,
          p.installsLabel,
          p.minInstalls,
          p.score,
          p.ratings,
          p.reviews,
          p.genre,
          p.releasedAt,
          p.updatedAt,
          p.version,
          p.adSupported ?? false,
          p.offersIap ?? false,
          p.sizeLabel,
          p.iconUrl,
          p.headerImageUrl,
          p.accentColor,
          p.featured,
          p.sortOrder,
        ]
          .map(sql)
          .join(", "),
      )
      .map((row) => `  (${row})`)
      .join(",\n") + ";",
  );
  lines.push("");
}

// -------------------------------------------------------- links/screenshots
const linkRows = mockProducts.flatMap((p) =>
  p.links.map((link, i) => ({
    slug: p.slug,
    label: link.label,
    url: link.url,
    kind: link.kind,
    order: i + 1,
  })),
);
if (linkRows.length) {
  lines.push(
    "INSERT INTO product_links (product_slug, label, url, kind, sort_order) VALUES",
  );
  lines.push(
    linkRows
      .map(
        (r) =>
          `  (${sql(r.slug)}, ${sql(r.label)}, ${sql(r.url)}, ${sql(r.kind)}, ${r.order})`,
      )
      .join(",\n") + ";",
  );
  lines.push("");
}

const shotRows = mockProducts.flatMap((p) =>
  p.screenshots.map((url, i) => ({ slug: p.slug, url, order: i + 1 })),
);
if (shotRows.length) {
  lines.push("INSERT INTO product_screenshots (product_slug, url, sort_order) VALUES");
  lines.push(
    shotRows
      .map((r) => `  (${sql(r.slug)}, ${sql(r.url)}, ${r.order})`)
      .join(",\n") + ";",
  );
  lines.push("");
}

const outPath = resolve(here, "../db/seed.sql");
writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
console.log(
  `Wrote ${outPath}\n  profile=1 stats=${mockProfile.stats.length} socials=${mockProfile.socials.length} ` +
    `experience=${mockExperience.length} products=${mockProducts.length} links=${linkRows.length} screenshots=${shotRows.length}`,
);
