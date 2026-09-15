import { DatabaseIcon } from "./icons";
import type { ProfileStat, Product } from "~/lib/types";
import { platformLabel } from "~/lib/types";

/**
 * The stat strip that closes the page: big serif numbers with small caps
 * labels underneath.
 *
 * "Apps shipped" and "Platforms" are derived from the live `products` table
 * rather than the stored copy, so the strip can never drift from the shelf
 * above it. The other stats (installs, years) stay as authored in D1.
 */
export function StatsBar({
  stats,
  products,
}: {
  stats: ProfileStat[];
  products: Product[];
}) {
  if (!stats.length) return null;

  const apps = products.filter((p) => p.platform !== "web");
  const platformCount = new Set(products.map((p) => platformLabel[p.platform])).size;

  const derived = (label: string): string | null => {
    const key = label.toLowerCase();
    if (key.includes("app")) return apps.length ? `${apps.length}+` : String(apps.length);
    if (key.includes("platform")) return String(platformCount);
    return null;
  };

  return (
    <dl className="stat-strip" style={{ margin: 0 }}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <dd className="stat-strip-value">{derived(stat.label) ?? stat.value}</dd>
          <dt className="stat-label" style={{ marginTop: 4 }}>
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

/** Inline banner shown when the site is running on the mock fixture. */
export function DataSourceNotice({ notice }: { notice: string }) {
  return (
    <div
      className="surface flex items-start gap-3"
      style={{
        padding: "12px 14px",
        background: "var(--accent-wash)",
        borderColor: "color-mix(in oklab, var(--accent) 25%, var(--border))",
        fontSize: 13,
      }}
    >
      <span style={{ color: "var(--accent)", marginTop: 1 }}>
        <DatabaseIcon size={16} />
      </span>
      <p className="muted" style={{ margin: 0, lineHeight: 1.55 }}>
        {notice}
      </p>
    </div>
  );
}
