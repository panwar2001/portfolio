import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

/**
 * Nested routing:
 *   app.tsx        → sidebar + footer chrome, loads the whole portfolio once
 *   home           → headline, stat strip, app shelves
 *   apps/:slug     → product detail (screenshots, description, store links)
 *   status         → which data source is live (D1 vs. mock fallback)
 *   newsletter     → resource route: the subscribe action (writes to D1)
 *   subscribers    → resource route: how many people subscribed (reads D1)
 *   sitemap.xml    → generated from the same D1 rows
 *
 * `/about`, `/projects` and `/projects/:slug` are 301 redirects kept for old
 * links.
 */
export default [
  layout("routes/app.tsx", [
    index("routes/home.tsx"),
    route("apps/:slug", "routes/app-detail.tsx"),
    route("status", "routes/status.tsx"),
    route("about", "routes/about.tsx"),
    route("projects", "routes/projects.tsx"),
    route("projects/:slug", "routes/project-detail.tsx"),
  ]),
  route("newsletter", "routes/newsletter.ts"),
  route("subscribers", "routes/subscribers.ts"),
  route("sitemap.xml", "routes/sitemap.ts"),
] satisfies RouteConfig;
