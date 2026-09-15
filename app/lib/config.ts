/**
 * Site-wide display switches.
 *
 * These only affect what the home page renders — the underlying data model and
 * components stay intact, so turning a shelf back on is a one-line change (or a
 * redeploy), with no schema or loader edits.
 */
export const siteConfig = {
  /**
   * Web apps shelf.
   *
   * `false` while there are no web apps to show: the "Web apps" heading and
   * grid are hidden even if `platform = 'web'` rows exist in D1. Set to `true`
   * (and add a web row) to bring the section back — `ProductShelf` already
   * renders it, and the detail page at `/apps/:slug` works either way.
   */
  showWebApps: false,
} as const;
