// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { execSync } from "node:child_process";

// JXN-000 — the site itself is a portfolio piece: static-first, clean under
// view-source, fast. Domain-agnostic per spec (lives at jxn.ddns.net for now,
// but nothing here assumes it).

let commit = "0000000";
try {
  commit = execSync("git rev-parse --short HEAD").toString().trim();
} catch {
  /* shallow or detached environments still get a build */
}

// Deploy target is env-driven. GitHub Pages project site serves from a
// subpath; the eventual custom domain (jxn.ddns.net) serves from root.
//   BASE_PATH=/personal-website  SITE=https://jxn01.github.io  → Pages
//   (unset)                                                    → root "/"
const BASE_PATH = process.env.BASE_PATH || "/";
const SITE = process.env.SITE || "https://jxn.ddns.net";

export default defineConfig({
  site: SITE,
  base: BASE_PATH,
  // SIDE A = en (canonical), SIDE B = hu. Faithful localization, structure-identical.
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hu"],
    routing: {
      prefixDefaultLocale: true, // /en and /hu both explicit — no ambiguous root
      redirectToDefaultLocale: false, // root redirect is ours: locale-sniffing index
    },
  },
  integrations: [react(), sitemap()],
  trailingSlash: "never",
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __COMMIT__: JSON.stringify(commit),
    },
  },
});
