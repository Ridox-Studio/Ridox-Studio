import { getProjectHref, type Project } from "@/app/data/projects";

/**
 * Where this design is mounted. Every internal link in the design goes
 * through `to()`, so promoting it to the live site is two steps: move the
 * contents of `app/(paper)/paper/` up into `app/(paper)/`, and set this to "".
 */
export const BASE = "/paper";

/** Site-relative path ("/work", "/blog/my-post") to a path inside this design. */
export function to(path: string): string {
  if (path === "/") return BASE || "/";
  return `${BASE}${path}`;
}

export function projectHref(project: Project): string {
  return to(getProjectHref(project));
}
