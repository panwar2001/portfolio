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
let pageOk = false;
let servedBy: string | null = null;

if (dnsOk) {
  try {
    const response = await fetch(`https://${host}/`, {
      redirect: "manual",
      headers: { "user-agent": "portfolio-domain-check" },
    });

    console.log(`${green("✔")} HTTPS responds ${response.status}`);
    servedBy = response.headers.get("cf-ray") ? "Cloudflare" : null;
    if (servedBy) console.log(dim(`    edge: ${servedBy}`));

    if (response.status >= 300 && response.status < 400) {
      console.log(
        dim(
          `    redirects to ${response.headers.get("location")}\n` +
            `    → if that is the is-a.dev "available" page, the record is not live yet.`,
        ),
      );
    }

    const html = await response.text();
    const markers = [
      "Ayush Panwar",
      "PDF to Text AI",
      "panwar2001",
    ];
    const found = markers.filter((marker) => html.includes(marker));
    pageOk = found.length === markers.length;

    if (pageOk) {
      console.log(`${green("✔")} Serving this portfolio`);
    } else {
      console.log(
        `${red("✘")} Response does not look like this portfolio (matched: ${
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
