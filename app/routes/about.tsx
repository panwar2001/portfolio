import { redirect } from "react-router";

/**
 * The story now lives in the sidebar (identity + experience) and in each app's
 * detail page, so `/about` simply returns to the app shelf.
 */
export function loader() {
  return redirect("/", { status: 301 });
}
