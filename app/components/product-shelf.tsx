import { ProductCard } from "./product-card";
import { siteConfig } from "~/lib/config";
import { mobileProducts, webProducts } from "~/lib/types";
import type { Product } from "~/lib/types";

/**
 * The home page shelf: every app in one grid, then web apps in a second grid.
 * Each section only renders when it has content, so a portfolio with no web
 * apps stays a single grid.
 *
 * The web shelf is additionally gated behind `siteConfig.showWebApps` — while
 * there is nothing to publish there, the section is hidden but the component,
 * the data model and `/apps/:slug` all keep working.
 */
export function ProductShelf({ products }: { products: Product[] }) {
  const apps = mobileProducts(products);
  const web = webProducts(products);

  return (
    <div className="flex flex-col gap-10">
      {apps.length ? (
        <section id="apps" className="flex flex-col gap-4">
          <h2 className="section-title">Apps</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {apps.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {siteConfig.showWebApps && web.length ? (
        <section id="web-apps" className="flex flex-col gap-4">
          <h2 className="section-title">Web apps</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {web.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
