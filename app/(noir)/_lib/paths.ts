import { getProjectHref, type Project } from "@/app/data/projects";

/**
 * Where this design is mounted. Same contract as the Paper draft: every
 * internal link goes through `to()`, so promotion is a folder move plus
 * setting this to "".
 */
export const BASE = "/noir";

export function to(path: string): string {
  if (path === "/") return BASE || "/";
  return `${BASE}${path}`;
}

export function projectHref(project: Project): string {
  return to(getProjectHref(project));
}
