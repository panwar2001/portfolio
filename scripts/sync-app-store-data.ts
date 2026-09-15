/**
 * Refresh the store numbers on the Android products.
 *
 *   npm run sync:apps            # update app/lib/mock-data.ts + db/seed.sql
 *   npm run sync:apps -- --write-d1   # ...and also push to the LOCAL D1
 *
 * What it updates, per Play Store app:
 *   installsLabel  Play's own bucket label, e.g. "500+"
 *   minInstalls    the numeric floor, used for the sidebar total
 *   version        current store version
 *   updatedAt      last store update (ISO date)
 *   score/ratings  only when the store actually reports a score
 *
 * iOS rows are never touched — Apple publishes no download counts, so those
 * stay hand-entered. Anything the script cannot verify is left exactly as it
 * was, and a report of every change is printed at the end.
 *
 * Requires the `google-play-scraper` dev dependency (scrapes Play's public
 * listing markup — there is no official API).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import gplay from "google-play-scraper";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const fixturesPath = resolve(root, "app/lib/mock-data.ts");
const seedPath = resolve(root, "db/seed.sql");

const WRITE_D1 = process.argv.includes("--write-d1");
const COUNTRY = process.env.PLAY_COUNTRY ?? "in";
const LANG = process.env.PLAY_LANG ?? "en";

/* ------------------------------------------------------------ label → floor */

const UNIT_MULTIPLIERS: Record<string, number> = {
  K: 1_000,
  M: 1_000_000,
  B: 1_000_000_000,
};

/** "10,000+" → 10000, "1.5K+" → 1500, "10+" → 10. */
function floorFromLabel(label: string | null | undefined): number | null {
  if (!label) return null;
  const match = /([\d.,]+)\s*([KMB])?/i.exec(label);
  if (!match) return null;
  const value = Number.parseFloat(match[1].replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  const multiplier = match[2] ? (UNIT_MULTIPLIERS[match[2].toUpperCase()] ?? 1) : 1;
  return Math.round(value * multiplier);
}

/* ------------------------------------------------------------ local rows */

interface LocalProduct {
  slug: string;
  title: string;
  platform: string;
  /** Play package id, read from the fixture's playUrl() call or store URL. */
  packageId: string | null;
  installsLabel: string;
  minInstalls: number;
  version: string | null;
  updatedAt: string | null;
  score: number | null;
  ratings: number;
  /** Original source text of the fixture object, replaced verbatim on write. */
  raw: string;
}

/** Locate a `platform: "android"` fixture object and read the fields we sync. */
function readAndroidProducts(source: string): LocalProduct[] {
  const products: LocalProduct[] = [];
  const marker = /\n  \{\n    slug: "([a-z0-9-]+)",/g;

  let match: RegExpExecArray | null;
  while ((match = marker.exec(source)) !== null) {
    const start = match.index + 1;
    const end = source.indexOf("\n  },", start);
    if (end === -1) continue;
    const raw = source.slice(start, end + 4);

    if (!/platform: "android"/.test(raw)) continue;

    const field = (name: string, quoted = true) => {
      const re = new RegExp(`\\n    ${name}: "((?:[^"\\\\]|\\\\.)*)",`);
      const found = re.exec(raw);
      if (!found) return null;
      // Undo the escaping we added when writing, plus the fixture's own \` escapes.
      return found[1].replace(/\\"/g, '"').replace(/\\`/g, "`");
    };

    // Numeric / literal fields (minInstalls, score, ratings…).
    const literal = (name: string) => {
      const re = new RegExp(`\\n    ${name}: ([^,\\n]+),`);
      const found = re.exec(raw);
      return found ? found[1].trim() : null;
    };

    // The fixture builds Play links with the playUrl() helper rather than a
    // literal, so read the package id straight out of the call when present.
    const packageId =
      /playUrl\("([^"]+)"\)/.exec(raw)?.[1] ??
      /play\.google\.com\/store\/apps\/details\?id=([\w.]+)/.exec(raw)?.[1] ??
      null;

    products.push({
      slug: match[1],
      title: field("title") ?? match[1],
      platform: "android",
      packageId,
      installsLabel: field("installsLabel") ?? "",
      minInstalls: Number(literal("minInstalls") ?? 0),
      version: field("version"),
      updatedAt: field("updatedAt"),
      score: literal("score") === "null" ? null : Number(literal("score")),
      ratings: Number(literal("ratings") ?? 0),
      raw,
    });
  }
  return products;
}

const isoDate = (timestamp: number | undefined | null) =>
  typeof timestamp === "number" && Number.isFinite(timestamp)
    ? new Date(timestamp).toISOString().slice(0, 10)
    : null;

/* ---------------------------------------------------------------- main */

const fixtures = readFileSync(fixturesPath, "utf8");
const products = readAndroidProducts(fixtures);

if (!products.length) {
  console.error("No Android products found in app/lib/mock-data.ts — nothing to sync.");
  process.exit(1);
}

console.log(`Syncing ${products.length} Play Store apps (${COUNTRY}/${LANG})…\n`);

const changes: string[] = [];
let nextFixtures = fixtures;

for (const product of products) {
  const packageId = product.packageId;

  if (!packageId) {
    console.log(`• ${product.title}: no Play package id found — skipped`);
    continue;
  }

  let listing: Awaited<ReturnType<typeof gplay.app>>;
  try {
    listing = await gplay.app({ appId: packageId, lang: LANG, country: COUNTRY });
  } catch (error) {
    console.warn(
      `• ${product.title}: could not read ${packageId} (${
        error instanceof Error ? error.message : String(error)
      }) — left unchanged`,
    );
    continue;
  }

  const label = listing.installs ?? product.installsLabel;
  const floor = listing.minInstalls ?? floorFromLabel(label) ?? product.minInstalls;
  const version = listing.version ?? product.version;
  const updatedAt = isoDate(listing.updated) ?? product.updatedAt;
  const score =
    typeof listing.score === "number" && listing.score > 0
      ? Math.round(listing.score * 10) / 10
      : product.score;
  const ratings =
    typeof listing.ratings === "number" && listing.ratings > 0
      ? listing.ratings
      : product.ratings;

  const diffs: string[] = [];
  if (label !== product.installsLabel) {
    diffs.push(`installs ${product.installsLabel || "—"} → ${label}`);
  }
  if (floor !== product.minInstalls) {
    diffs.push(`minInstalls ${product.minInstalls} → ${floor}`);
  }
  if (version !== product.version) {
    diffs.push(`version ${product.version ?? "—"} → ${version ?? "—"}`);
  }
  if (updatedAt !== product.updatedAt) {
    diffs.push(`updated ${product.updatedAt ?? "—"} → ${updatedAt ?? "—"}`);
  }
  if (score !== product.score) {
    diffs.push(`score ${product.score ?? "—"} → ${score ?? "—"}`);
  }
  if (ratings !== product.ratings) {
    diffs.push(`ratings ${product.ratings} → ${ratings}`);
  }

  console.log(
    diffs.length
      ? `• ${product.title}: ${diffs.join(", ")}`
      : `• ${product.title}: up to date (${label})`,
  );
  if (!diffs.length) continue;

  changes.push(`${product.title} (${packageId})`);

  // Rewrite the fixture object field by field so formatting is preserved.
  let raw = product.raw;
  const setString = (name: string, value: string) => {
    raw = raw.replace(
      new RegExp(`(\\n    ${name}: )"(?:[^"\\\\]|\\\\.)*",`),
      `$1"${value.replace(/"/g, '\\"')}",`,
    );
  };
  const setRaw = (name: string, value: string) => {
    raw = raw.replace(new RegExp(`(\\n    ${name}: )[^,\\n]+,`), `$1${value},`);
  };

  setString("installsLabel", label);
  setRaw("minInstalls", String(floor));
  if (version) setString("version", version);
  if (updatedAt) setString("updatedAt", updatedAt);
  setRaw("score", score === null ? "null" : String(score));
  setRaw("ratings", String(ratings));

  nextFixtures = nextFixtures.replace(product.raw, raw);
}

if (!changes.length) {
  console.log("\nNothing changed — fixtures and seed are already current.");
  process.exit(0);
}

writeFileSync(fixturesPath, nextFixtures, "utf8");
console.log(`\nUpdated ${changes.length} product(s) in app/lib/mock-data.ts`);

// Regenerate db/seed.sql from the refreshed fixtures (single source of truth).
execFileSync(process.execPath, ["--experimental-strip-types", resolve(here, "generate-seed.ts")], {
  cwd: root,
  stdio: "inherit",
});

console.log("Regenerated db/seed.sql");
console.log(
  WRITE_D1
    ? "\nApplying the seed to the LOCAL D1 database…"
    : "\nNext steps:\n  npm run db:seed:local    # local D1\n  npm run db:seed:remote   # production D1\n",
);

if (WRITE_D1) {
  execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "portfolio_db", "--local", `--file=${seedPath}`],
    { cwd: root, stdio: "inherit" },
  );
}
