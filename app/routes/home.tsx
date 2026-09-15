import { useRouteLoaderData } from "react-router";

import { DataSourceNotice } from "~/components/stats";
import { ProductShelf } from "~/components/product-shelf";
import { ArrowUpRightIcon, PlayIcon } from "~/components/icons";
import type { Route } from "./+types/home";
import type { loader as layoutLoader } from "./app";
import { mobileProducts, totalInstallsLabel } from "~/lib/types";

export function meta({ matches }: Route.MetaArgs) {
  const layout = matches.find((m) => m?.id === "routes/app")?.loaderData as
    | {
        profile?: { name: string; headline: string; tagline: string };
      }
    | undefined;
  const name = layout?.profile?.name ?? "Ayush Panwar";
  const headline = layout?.profile?.headline ?? "App Developer";

  return [
    { title: `${name} — ${headline}` },
    { name: "description", content: layout?.profile?.tagline ?? "" },
    { property: "og:title", content: `${name} — ${headline}` },
    { property: "og:description", content: layout?.profile?.tagline ?? "" },
  ];
}

export default function Home() {
  const data = useRouteLoaderData<typeof layoutLoader>("routes/app");
  if (!data) return null;

  const apps = mobileProducts(data.products);

  return (
    <div className="flex flex-col gap-9">
      {data.notice ? <DataSourceNotice notice={data.notice} /> : null}

      <section className="flex flex-col gap-3">
        <p className="eyebrow">
          {apps.length} apps · {totalInstallsLabel(data.products)} installs
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 3.4vw, 34px)",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            fontWeight: 400,
            margin: 0,
            maxWidth: 620,
          }}
        >
          Small apps that do one thing properly.
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <a
            className="btn btn-primary"
            href="https://play.google.com/store/apps/dev?id=4944030915077582132"
            target="_blank"
            rel="noopener noreferrer"
          >
            <PlayIcon size={14} />
            Google Play
            <ArrowUpRightIcon size={13} />
          </a>
        </div>
      </section>

      <ProductShelf products={data.products} />
    </div>
  );
}
