import type { Config } from "@react-router/dev/config";

export default {
  // Server-rendered: every loader reads its content from D1 (or the mock
  // fallback) on each request, so the site updates without a redeploy.
  ssr: true,
} satisfies Config;
