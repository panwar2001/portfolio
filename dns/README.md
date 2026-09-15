# Custom domain — `ayushpanwar.is-a.dev`

The site is live at
<https://ayush-panwar-portfolio.ayushpanwar691.workers.dev>. This folder holds the
record that points `ayushpanwar.is-a.dev` at it.

`ayushpanwar.is-a.dev` is currently **unclaimed**, so the record has to be added
to the [is-a-dev/register](https://github.com/is-a-dev/register) registry first.
PR: <https://github.com/is-a-dev/register/pull/52442>

## Why a `URL` record and not a `CNAME`

is-a.dev **rejects any CNAME ending in `.workers.dev`** — it is on their
[disallowed list](https://github.com/is-a-dev/register/blob/main/util/disallowed-cnames.json)
and enforced by `tests/records.test.js`:

```
✘ records › All files should have valid records
  ayushpanwar.json: CNAME cannot end with .workers.dev
```

A Workers custom domain / route is not an option either: both need the zone
(`is-a.dev`) inside the Cloudflare account, and routes on an external zone are a
paid-plan feature.

So the supported pattern — the one **every** `workers.dev` site on is-a.dev
uses (`hdgr`, `raneem`, `markbel.belal`, …) — is their custom `URL` record. It
issues a redirect to the Worker. Result: visitors reach the site through
`ayushpanwar.is-a.dev`, which is the point; the redirected-to hostname is visible
in the address bar.

## The record

[`ayushpanwar.is-a.dev.json`](./ayushpanwar.is-a.dev.json):

```json
{
  "owner": { "username": "panwar2001", "email": "ayushpanwar691@gmail.com" },
  "records": { "URL": "https://ayush-panwar-portfolio.ayushpanwar691.workers.dev" }
}
```

No `proxied` key: a `URL` record is not a real DNS record, it is is-a.dev's own
redirector, and `proxied: true` requires one of `A` / `AAAA` / `CNAME`.

Validated against their suite before opening the PR:

```bash
node -e "
const d=require('./util/disallowed-cnames.json');
const v='ayush-panwar-portfolio.ayushpanwar691.workers.dev';
console.log(d.filter(x=>x.startsWith('.')?v.endsWith(x):v===x));  // []
"
```

## Verifying it works

Once is-a.dev merges the record:

```bash
npm run verify:domain
```

It checks DNS, the HTTPS response, that the response is a redirect to the Worker
(or the site itself), and that the served page really is this portfolio.

## Notes

- **Renaming the Worker** (in `wrangler.jsonc`) changes its `workers.dev`
  hostname and breaks this record. Update both together.
- If you later want `ayushpanwar.is-a.dev` in the address bar with no redirect,
  the only route is to deploy somewhere is-a.dev CNAMEs are allowed — Cloudflare
  **Pages** (`<project>.pages.dev`) or Vercel/Netlify — instead of Workers.
