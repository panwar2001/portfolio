import { Outlet, useLocation, useRouteLoaderData } from "react-router";

import { MobileNav, SiteFooter } from "~/components/shell";
import { Sidebar } from "~/components/sidebar";
import { StatsBar } from "~/components/stats";
import type { Route } from "./+types/app";
import { getSiteData } from "~/lib/portfolio.server";

/**
 * Layout route: loads the entire portfolio from D1 (or the mock fixture) once
 * per navigation and shares it with every child route through
 * `useRouteLoaderData("routes/app")`.
 */
export async function loader({ context }: Route.LoaderArgs) {
  const data = await getSiteData(context);
  return {
    profile: data.profile,
    experience: data.experience,
    products: data.products,
    source: data.source,
    notice: data.notice,
  };
}

export function meta() {
  return [{ title: "Ayush Panwar — App Developer" }];
}

export default function AppLayout() {
  const data = useRouteLoaderData<typeof loader>("routes/app");
  const location = useLocation();
  if (!data) return null;

  return (
    <div className="flex w-full flex-col lg:flex-row">
      <Sidebar
        profile={data.profile}
        experience={data.experience}
        products={data.products}
        source={data.source}
        notice={data.notice}
      />
      <main className="min-w-0 flex-1 px-6 py-9 lg:px-10 2xl:px-14">
        <div className="lg:hidden">
          <MobileNav profile={data.profile} home={location.pathname === "/"} />
        </div>
        <div className="w-full 2xl:max-w-[1100px]">
          <Outlet />
          <div style={{ marginTop: 48 }}>
            <StatsBar stats={data.profile.stats} products={data.products} />
          </div>
          <SiteFooter
            profile={data.profile}
            appCount={data.products.filter((p) => p.platform !== "web").length}
          />
        </div>
      </main>
    </div>
  );
}
