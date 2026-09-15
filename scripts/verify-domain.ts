/**
 * Check that the custom domain is wired to this portfolio.
 *
 *   npm run verify:domain                     # checks ayushpanwar.is-a.dev
 *   npm run verify:domain -- my.domain.com    # checks any host
 *
 * Reports DNS, the HTTPS response and whether the served HTML is this site —
 * so it is obvious whether is-a.dev has published the record yet.
 */
import { lookup } from "node:dns/promises";
import { resolveTxt } from "node:dns/promises";

const DEFAULT_HOST = "ayushpanwar.is-a.dev";
const WORKER_HOST = "ayush-panwar-portfolio.ayushpanwar691.workers.dev";
const WORKER_URL = `https://${WORKER_HOST}/`;

const host = process.argv[2] ?? DEFAULT_HOST;

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

console.log(`\nVerifying ${host}\n${"─".repeat(60)}`);

/* ----------------------------------------------------------------- DNS */
let dnsOk = false;
try {
  const records = await lookup(host, { all: true });
  dnsOk = true;
  console.log(`${green("✔")} DNS resolves`);
  for (const record of records) {
    console.log(dim(`    ${record.family}  ${record.address}`));
  }
} catch (error) {
  console.log(`${red("✘")} DNS does not resolve yet`);
  console.log(
    dim(
      `    ${error instanceof Error ? error.message : String(error)}\n` +
        `    → is-a.dev has not published the record. Open the PR described in dns/README.md.`,
    ),
  );
}

try {
  const txt = await resolveTxt(`_dnslink.${host}`).catch(() => []);
  if (txt.length) console.log(dim(`    TXT: ${txt.flat().join(", ")}`));
} catch {
  /* optional */
}

/* --------------------------------------------------------------- HTTPS */
const MARKERS = ["Ayush Panwar", "PDF to Text AI", "panwar2001"];

/** Fetch a URL and report whether the HTML looks like this portfolio. */
async function looksLikePortfolio(url: string) {
  const response = await fetch(url, {
    headers: { "user-agent": "portfolio-domain-check" },
  });
  const html = await response.text();
  const found = MARKERS.filter((marker) => html.includes(marker));
  return { ok: found.length === MARKERS.length, status: response.status, found, html };
}

let pageOk = false;

if (dnsOk) {
  try {
    const response = await fetch(`https://${host}/`, {
      redirect: "manual",
      headers: { "user-agent": "portfolio-domain-check" },
    });

    console.log(`${green("✔")} HTTPS responds ${response.status}`);
    if (response.headers.get("cf-ray")) console.log(dim(`    edge: Cloudflare`));

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location") ?? "";
      console.log(dim(`    redirects to ${location}`));

      // is-a.dev's URL record issues this redirect; that is the expected setup.
      if (location === WORKER_URL) {
        console.log(`${green("✔")} Redirect targets this Worker (is-a.dev URL record)`);
        const target = await looksLikePortfolio(WORKER_URL);
        pageOk = target.ok;
        console.log(
          target.ok
            ? `${green("✔")} Worker serves this portfolio`
            : `${red("✘")} Worker response did not look like this portfolio`,
        );
      } else if (location.includes("is-a.dev/available")) {
        console.log(
          red("✘") + dim("  that is the is-a.dev \"available\" page — record not live yet"),
        );
      } else {
        const target = await looksLikePortfolio(location).catch(() => null);
        pageOk = target?.ok ?? false;
        if (pageOk) console.log(`${green("✔")} Redirect target serves this portfolio`);
      }
    } else {
      const html = await response.text();
      const found = MARKERS.filter((marker) => html.includes(marker));
      pageOk = found.length === MARKERS.length;

      console.log(
        pageOk
          ? `${green("✔")} Serving this portfolio`
          : `${red("✘")} Response does not look like this portfolio (matched: ${
              found.join(", ") || "nothing"
            })`,
      );
    }
  } catch (error) {
    console.log(
      `${red("✘")} HTTPS request failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/* ------------------------------------------------------ control compare */
try {
  const control = await fetch(`https://${WORKER_HOST}/`);
  const controlHtml = await control.text();
  console.log(
    dim(
      `\ncontrol: ${WORKER_HOST} → ${control.status} (${
        controlHtml.includes("Ayush Panwar") ? "portfolio" : "unexpected"
      })`,
    ),
  );
} catch (error) {
  console.log(
    dim(`\ncontrol: could not reach ${WORKER_HOST} — ${String(error)}`),
  );
}

console.log(`${"─".repeat(60)}`);
if (dnsOk && pageOk) {
  console.log(green(`\n${host} is live and serving the portfolio.\n`));
} else {
  console.log(
    red(
      `\n${host} is not ready yet. Next step: open the is-a.dev PR — see dns/README.md.\n`,
    ),
  );
  process.exitCode = 1;
}
