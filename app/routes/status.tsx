import { Link, useRouteLoaderData } from "react-router";

import { DatabaseIcon } from "~/components/icons";
import type { Route } from "./+types/status";
import type { loader as layoutLoader } from "./app";

export function meta() {
  return [{ title: "Data source — Ayush Panwar" }];
}

/**
 * Small operational page: shows whether the site is reading from D1 or has
 * fallen back to the bundled fixture, plus the SQL to fix it.
 */
export default function StatusPage() {
  const layout = useRouteLoaderData<typeof layoutLoader>("routes/app");
  if (!layout) return null;

  const live = layout.source === "d1";
  const products = layout.products;

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: 640 }}>
      <nav className="faint flex items-center gap-1.5 text-[12.5px]">
        <Link to="/" className="hover:opacity-80">
          Apps
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }}>Data source</span>
      </nav>

      <div
        className="surface flex items-center gap-3"
        style={{
          padding: 16,
          background: live ? "var(--surface-2)" : "var(--accent-wash)",
        }}
      >
        <span style={{ color: "var(--accent)" }}>
          <DatabaseIcon size={18} />
        </span>
        <div>
          <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>
            {live ? "Live: Cloudflare D1" : "Fallback: bundled mock data"}
          </p>
          <p className="muted" style={{ margin: "2px 0 0", fontSize: 12.5 }}>
            {layout.notice ??
              `${products.length} products read from the DB binding on every request.`}
          </p>
        </div>
      </div>

      <section className="surface" style={{ padding: 16 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 14 }}>Loaded</h2>
        <dl style={{ margin: 0, fontSize: 13 }}>
          {[
            ["Profile", layout.profile.name],
            ["Products", String(products.length)],
            ["Experience rows", String(layout.experience.length)],
            ["Stats", String(layout.profile.stats.length)],
            ["Social links", String(layout.profile.socials.length)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4"
              style={{ padding: "6px 0", borderBottom: "1px solid var(--border)" }}
            >
              <dt className="muted">{label}</dt>
              <dd style={{ margin: 0, fontFamily: "var(--font-mono)" }}>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="surface" style={{ padding: 16 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 14 }}>Attaching D1 (first deploy)</h2>
        <ol
          className="muted flex flex-col gap-1.5 p-0"
          style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}
        >
          <li>
            <code>npm run db:create</code> — copy the database id into{" "}
            <code>wrangler.jsonc</code>
          </li>
          <li>
            <code>npm run db:setup:remote</code> — migrations + seed
          </li>
          <li>
            <code>npm run deploy</code>
          </li>
        </ol>
      </section>
    </div>
  );
}
