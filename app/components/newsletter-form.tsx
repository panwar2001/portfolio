import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

import type { SubscriberCount } from "~/routes/subscribers";
import { CheckIcon, UsersIcon } from "./icons";

export interface SubscribeResponse {
  ok: boolean;
  email?: string;
  duplicate?: boolean;
  error?: string;
}

interface NewsletterBlockProps {
  id?: string;
  /** Heading above the input. */
  title?: string;
  cta?: string;
  placeholder?: string;
  hint?: string;
}

/**
 * "Follow the journey": the subscribe form plus a live count of how many people
 * have dropped their email.
 *
 * The count lives in D1 (`subscribers`) and is read through the `subscribers`
 * resource route with a fetcher, so:
 *   · the page render never waits on it,
 *   · a successful submit re-runs the COUNT(*) and the number updates instantly,
 *   · the count is never stored in two places.
 */
export function NewsletterBlock({
  id = "newsletter",
  title = "Follow the journey ✌️",
  cta = "Subscribe",
  placeholder = "Your email...",
  hint,
}: NewsletterBlockProps) {
  const submit = useFetcher<SubscribeResponse>();
  const countFetcher = useFetcher<SubscriberCount>();
  const [count, setCount] = useState<number | null>(null);

  const busy = submit.state !== "idle";
  const result = submit.data;
  const done = result?.ok === true;

  // Load the current count once.
  useEffect(() => {
    if (countFetcher.state === "idle" && countFetcher.data === undefined) {
      countFetcher.load("/subscribers");
    }
  }, [countFetcher]);

  // Adopt whatever the resource route reports.
  useEffect(() => {
    if (typeof countFetcher.data?.count === "number") {
      setCount(countFetcher.data.count);
    }
  }, [countFetcher.data]);

  // After a successful submit, re-read the count from D1.
  useEffect(() => {
    if (submit.state === "idle" && result?.ok === true) {
      countFetcher.load("/subscribers");
    }
    // Only when a submit finishes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submit.state, result]);

  const countKnown = count !== null;
  const countUnavailable = countFetcher.data?.available === false;

  return (
    <div className="flex flex-col gap-2.5">
      <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{title}</p>

      <submit.Form
        method="post"
        action="/newsletter"
        id={id}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          className="input"
          type="email"
          name="email"
          required
          placeholder={placeholder}
          aria-label="Email for updates"
          disabled={done}
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={busy || done}
          style={{ padding: "9px 13px", fontSize: 13, whiteSpace: "nowrap" }}
        >
          {done ? <CheckIcon size={14} /> : null}
          {done ? "Subscribed" : busy ? "…" : cta}
        </button>
      </submit.Form>

      {result?.ok === false && result.error ? (
        <p style={{ fontSize: 12, color: "#dc2626", margin: 0 }}>{result.error}</p>
      ) : done ? (
        <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>
          {result?.duplicate
            ? "You're already on the list — thanks!"
            : "Thanks! You'll hear about new apps first."}
        </p>
      ) : hint ? (
        <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>{hint}</p>
      ) : null}

      <p
        className="faint flex items-center gap-1.5"
        style={{ fontSize: 12, margin: 0 }}
        aria-live="polite"
      >
        <UsersIcon size={13} />
        {countKnown ? (
          <>
            <strong style={{ color: "var(--text-2)" }}>{count}</strong>
            {count === 1 ? "person following along" : "people following along"}
          </>
        ) : countUnavailable ? (
          "Be the first to follow along"
        ) : (
          "Counting subscribers…"
        )}
      </p>
    </div>
  );
}
