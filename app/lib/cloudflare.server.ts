import { createContext } from "react-router";

/**
 * Server-only bridge between the Cloudflare Worker entry (`workers/app.ts`)
 * and React Router loaders/actions.
 *
 * React Router v8 always hands a `RouterContextProvider` to loaders, so the
 * Worker entry stores the bindings under this token and route modules read
 * them back with `context.get(cloudflareContext)`.
 *
 * The `.server.ts` suffix keeps this module out of client bundles.
 */
export const cloudflareContext = createContext<{
  env: Env;
  ctx: ExecutionContext;
}>({ env: {} as Env, ctx: {} as ExecutionContext });

/** Read the Cloudflare bindings from a loader/action context, if present. */
export function getCloudflareEnv(context: unknown): Env | null {
  const ctx = context as
    | {
        cloudflare?: { env?: Env };
        get?: (token: unknown) => unknown;
      }
    | undefined;
  if (!ctx) return null;

  // v8 style: RouterContextProvider + createContext token.
  if (typeof ctx.get === "function") {
    try {
      const value = ctx.get(cloudflareContext) as { env?: Env } | undefined;
      if (value?.env) return value.env;
    } catch {
      // Token not set in this context — fall through.
    }
  }

  // v7 style: plain object load context (`{ cloudflare: { env, ctx } }`).
  if (ctx.cloudflare?.env) return ctx.cloudflare.env;

  return null;
}
