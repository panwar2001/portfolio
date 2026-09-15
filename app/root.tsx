import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=JetBrains+Mono:wght@400;600&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#faf7f2" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Something went wrong";
  let details = "An unexpected error occurred while rendering this page.";

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    details =
      typeof error.data === "string"
        ? error.data
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
  }

  return (
    <main
      className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center gap-4 px-6 py-16"
      style={{ background: "var(--bg)" }}
    >
      <p className="stat-label">404 / error</p>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 30,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        {title}
      </h1>
      <p className="muted" style={{ margin: 0, lineHeight: 1.65 }}>
        {details}
      </p>
      <div className="flex gap-2">
        <a className="btn btn-primary" href="/">
          Back home
        </a>
        <a className="btn" href="/apps">
          Browse apps
        </a>
      </div>
    </main>
  );
}
