import type { Route } from "./+types/newsletter";

import { subscribeEmail } from "~/lib/portfolio.server";
import type { SubscribeResponse } from "~/components/newsletter-form";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Resource route backing <NewsletterBlock /> (the subscribe form).
 * Writes to the D1 `subscribers` table.
 */
export async function action({
  request,
  context,
}: Route.ActionArgs): Promise<SubscribeResponse> {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();
  const source = String(form.get("source") ?? "home");

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "That does not look like a valid email." };
  }

  const result = await subscribeEmail(context, email.toLowerCase(), source);
  if (!result.ok) return { ok: false, error: result.error };

  return { ok: true, email, duplicate: result.duplicate };
}
