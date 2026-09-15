import { redirect } from "react-router";

/**
 * The old web-apps listing is now the "Web apps" tab on the home page,
 * so this path just sends visitors back to the shelf.
 */
export function loader() {
  return redirect("/", { status: 301 });
}
