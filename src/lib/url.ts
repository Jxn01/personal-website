/**
 * Base-path awareness. GitHub Pages project sites serve from a subpath
 * (/personal-website/), a custom domain serves from root (/). BASE_URL is
 * set by astro.config from the BASE_PATH env var — default "/".
 *
 * Works in both server (.astro) and client (islands): Vite inlines
 * import.meta.env.BASE_URL at build. For `is:inline` scripts, which Vite
 * does NOT process, pass BASE explicitly via define:vars.
 */
const RAW = import.meta.env.BASE_URL; // "/" or "/personal-website/"
export const BASE = RAW.replace(/\/$/, ""); // "" or "/personal-website"

/** Prefix an internal absolute path with the base. Leaves URLs/anchors alone. */
export function withBase(path: string): string {
  if (/^(https?:|mailto:|tel:|#|\/\/)/.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${p}` || "/";
}

/** The locale segment of a pathname, base-aware. "" if none. */
export function localeOf(pathname: string): string {
  const rest = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return rest.split("/").filter(Boolean)[0] ?? "";
}
