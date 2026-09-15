import { data, Link, useLoaderData, useRouteLoaderData } from "react-router";

import {
  audienceLabel,
  formatDate,
  platformLabel,
  storeLabel,
} from "~/lib/types";
import type { Product } from "~/lib/types";
import { ArrowRightIcon, ArrowUpRightIcon, StarIcon, storeIcons } from "~/components/icons";
import { ProductCard } from "~/components/product-card";
import type { Route } from "./+types/app-detail";
import { getProduct } from "~/lib/portfolio.server";

/** Detail loader — a direct D1 read for the requested slug. */
export async function loader({ params, context }: Route.LoaderArgs) {
  const result = await getProduct(context, params.slug);

  if (!result) {
    throw data(`No app with the slug "${params.slug}".`, { status: 404 });
  }

  return { product: result.product, source: result.source };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const product = loaderData?.product;
  if (!product) return [{ title: "App not found" }];
  return [
    { title: `${product.title} — Ayush Panwar` },
    { name: "description", content: product.tagline },
    { property: "og:title", content: product.title },
    { property: "og:description", content: product.tagline },
    ...(product.headerImageUrl
      ? [{ property: "og:image", content: product.headerImageUrl }]
      : []),
  ];
}

function initials(title: string) {
  return title.replace(/[^a-zA-Z0-9 ]/g, " ").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function AppDetail() {
  const { product } = useLoaderData<typeof loader>();
  const layout = useRouteLoaderData("routes/app") as
    | { products: Product[] }
    | undefined;

  const StoreIcon = storeIcons[product.platform] ?? storeIcons.other;
  const related = (layout?.products ?? [])
    .filter((p) => p.slug !== product.slug && p.platform === product.platform)
    .slice(0, 3);

  const audience = audienceLabel(product);
  const updated = formatDate(product.updatedAt);
  const released = formatDate(product.releasedAt);

  const meta = [
    audience,
    product.genre || null,
    product.version ? `v${product.version}` : null,
    updated ? `Updated ${updated}` : null,
    released ? `Released ${released}` : null,
  ].filter(Boolean) as string[];

  return (
    <article className="flex flex-col gap-6">
      <nav className="faint flex items-center gap-1.5 text-[12.5px]">
        <Link to="/" className="hover:opacity-80">
          Apps
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }}>{product.title}</span>
      </nav>

      <header className="flex flex-wrap items-start gap-5">
        <div
          className="card-icon"
          style={{ width: 88, height: 88, borderRadius: 20, fontSize: 28 }}
        >
          {product.iconUrl ? (
            <img
              src={product.iconUrl}
              alt=""
              width={88}
              height={88}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            initials(product.title)
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(23px, 3vw, 30px)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              {product.title}
            </h1>
            <span className="pill">
              <StoreIcon size={11} />
              {platformLabel[product.platform]}
            </span>
          </div>

          <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
            {product.tagline}
          </p>

          <p className="faint" style={{ margin: 0, fontSize: 12.5 }}>
            {meta.join(" · ")}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            {product.storeUrl ? (
              <a
                className="btn btn-primary"
                href={product.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StoreIcon size={14} />
                {storeLabel[product.platform]}
                <ArrowUpRightIcon size={13} />
              </a>
            ) : null}
            {product.links
              .filter((link) => link.url !== product.storeUrl)
              .map((link) => {
                const Icon = storeIcons[link.kind] ?? storeIcons.other;
                return (
                  <a
                    key={link.url}
                    className="btn"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={13} />
                    {link.label}
                  </a>
                );
              })}
          </div>
        </div>
      </header>

      {product.screenshots.length ? (
        <div className="rail">
          {product.screenshots.map((url, index) => (
            <figure
              key={url}
              className="shot"
              style={{
                width: 180,
                margin: 0,
                borderColor:
                  index === 0
                    ? "color-mix(in oklab, var(--accent) 30%, var(--border))"
                    : undefined,
              }}
            >
              <img
                src={url}
                alt={`${product.title} screenshot ${index + 1}`}
                loading={index < 2 ? "eager" : "lazy"}
              />
            </figure>
          ))}
        </div>
      ) : null}

      {product.description ? (
        <div className="prose-body" style={{ maxWidth: 720 }}>
          {product.description}
        </div>
      ) : null}

      {related.length ? (
        <section className="flex flex-col gap-3">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 21,
              fontWeight: 400,
              margin: 0,
            }}
          >
            More apps
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <Link
        className="btn"
        to="/"
        style={{ alignSelf: "flex-start", marginTop: 4 }}
      >
        <ArrowRightIcon size={13} style={{ transform: "rotate(180deg)" }} />
        All apps
      </Link>
    </article>
  );
}
