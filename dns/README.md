# Custom domain — `ayushpanwar.is-a.dev`

The site is live at
<https://ayush-panwar-portfolio.ayushpanwar691.workers.dev>. This folder holds
the record to point `ayushpanwar.is-a.dev` at it.

`ayushpanwar.is-a.dev` is currently **unclaimed** (it redirects to is-a.dev's
"available" page), so the record has to be added to the
[is-a-dev/register](https://github.com/is-a-dev/register) registry first.

## 1. Open the pull request

1. Fork <https://github.com/is-a-dev/register> (or use the
   [web editor](https://github.com/is-a-dev/register/new/main/domains) if you
   have write access to a fork).
2. Add a file named **`domains/ayushpanwar.json`** containing exactly
   [`ayushpanwar.is-a.dev.json`](./ayushpanwar.is-a.dev.json) from this folder.
   The filename is the subdomain: `ayushpanwar.json` → `ayushpanwar.is-a.dev`.
3. Open a PR against `is-a-dev/register:main`.

Their README asks you to write the request yourself — automated/AI-authored
requests get rejected, so treat the file above as a reference and describe the
change in your own words.

## 2. What the record does

```json
{
  "owner": { "username": "panwar2001", "email": "ayushpanwar691@gmail.com" },
  "records": { "CNAME": "ayush-panwar-portfolio.ayushpanwar691.workers.dev" },
  "proxied": true
}
```

- **`CNAME`** — resolves the subdomain to the Worker's `workers.dev` hostname.
- **`proxied: true`** — is-a.dev's DNS runs on Cloudflare, so the record is
  proxied and HTTPS is served by Cloudflare's edge. This is the setting their
  own docs use (see `domains/docs.json`).

Once merged, DNS usually propagates within minutes.

## 3. Verify it worked

```bash
npm run verify:domain
```

That checks DNS resolution, the HTTPS handshake and that the served page is
actually this portfolio (and reports the Worker it is being served from).

## Notes

- **Worker routes are not needed.** A proxy-able CNAME plus a `workers.dev`
  hostname is enough; no `routes` entry is added to `wrangler.jsonc`.
- **If it ever fails to serve**, the fallback is is-a.dev's `URL` record type,
  which issues a plain 301 redirect:

  ```json
  { "records": { "URL": "https://ayush-panwar-portfolio.ayushpanwar691.workers.dev" } }
  ```

  That works without the proxy, but visitors would see the `workers.dev`
  hostname in the address bar, so prefer the CNAME.
- **Changing the Worker name** (in `wrangler.jsonc`) changes the `workers.dev`
  hostname, which would break this CNAME. Update both together.
