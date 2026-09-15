import type { LoaderFunctionArgs } from "react-router";

import { getCloudflareEnv } from "~/lib/cloudflare.server";

export interface SubscriberCount {
  count: number;
  /** false when the count could not be read (no D1 binding / not migrated). */
  available: boolean;
}

/**
 * Resource route: how many people are following the build.
 *
 * Read on its own (rather than in the page loader) so subscribing can refresh
 * just this number instead of re-running every D1 query on the page.
 */
export async function loader({ context }: LoaderFunctionArgs) {
  const env = getCloudflareEnv(context);

  if (!env?.DB) {
    return Response.json({ count: 0, available: false } satisfies SubscriberCount);
  }

  try {
    const row = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM subscribers",
    ).first<{ count: number }>();

    return Response.json(
      { count: row?.count ?? 0, available: true } satisfies SubscriberCount,
      // Short cache: a burst of page views should not hammer D1.
      { headers: { "Cache-Control": "public, max-age=60" } },
    );
  } catch (error) {
    console.warn("[portfolio] subscriber count unavailable:", error);
    return Response.json({ count: 0, available: false } satisfies SubscriberCount);
  }
}
