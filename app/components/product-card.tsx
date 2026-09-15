import { Link, useLocation } from "react-router";

import { audienceLabel } from "~/lib/types";
import type { Product } from "~/lib/types";

import { ArrowUpRightIcon, UsersIcon } from "./icons";

function initials(title: string) {
  return title
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Compact shelf card: icon + name + audience pill on the first row, tagline
 * underneath. The whole card opens the detail page; the store badge fades in on
 * hover so the resting state stays as quiet as the reference.
 */
export function ProductCard({ product }: { product: Product }) {
  const location = useLocation();
  const audience = audienceLabel(product);

  return (
    <article className="card" style={{ position: "relative" }}>
      <Link
        to={`/apps/${product.slug}`}
        state={{ from: location.pathname }}
        aria-label={`${product.title} details`}
        style={{ position: "absolute", inset: 0, borderRadius: 14, zIndex: 0 }}
      />

      <div
        className="flex items-center gap-3"
        style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}
      >
        <div className="card-icon">
          {product.iconUrl ? (
            <img
              src={product.iconUrl}
              alt=""
              width={46}
              height={46}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            initials(product.title)
          )}
        </div>

        <h3
          style={{
            margin: 0,
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.title}
        </h3>

        {audience ? (
          <span className="pill pill-users" style={{ flexShrink: 0 }}>
            <UsersIcon size={11} />
            {product.installsLabel}
          </span>
        ) : null}
      </div>

      <p
        className="muted"
        style={{
          margin: 0,
          fontSize: 13,
          lineHeight: 1.55,
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {product.tagline}
      </p>

      {product.storeUrl ? (
        <a
          className="faint flex items-center gap-1 text-[11.5px] hover:opacity-70"
          style={{ position: "relative", zIndex: 2, alignSelf: "flex-start" }}
          href={product.storeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
          <ArrowUpRightIcon size={11} />
        </a>
      ) : null}
    </article>
  );
}
