import type { Route } from "./+types/sitemap";
import { getSiteData } from "~/lib/portfolio.server";

/** /sitemap.xml — generated from the same D1 rows the pages render. */
export async function loader({ request, context }: Route.LoaderArgs) {
  const { products } = await getSiteData(context);
  const origin = new URL(request.url).origin;

  const urls = [
    { loc: `${origin}/`, priority: "1.0" },
    ...products.map((product) => ({
      loc: `${origin}/apps/${product.slug}`,
      priority: product.featured ? "0.8" : "0.6",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority }) =>
      `  <url><loc>${loc}</loc><priority>${priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
