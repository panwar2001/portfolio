import { redirect } from "react-router";
import type { Route } from "./+types/project-detail";

/** Web apps now live at the same detail path as every other product. */
export function loader({ params }: Route.LoaderArgs) {
  return redirect(`/apps/${params.slug}`, { status: 301 });
}
