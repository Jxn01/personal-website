// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// JXN-000 — the site itself is a portfolio piece: static-first, clean under
// view-source, fast. Domain-agnostic per spec (lives at jxn.ddns.net for now,
// but nothing here assumes it).
export default defineConfig({
  site: "https://jxn.ddns.net",
  // SIDE A = en (canonical), SIDE B = hu. Faithful localization, structure-identical.
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hu"],
    routing: {
      prefixDefaultLocale: true, // /en and /hu both explicit — no ambiguous root
    },
  },
  integrations: [react(), sitemap()],
  // View Transitions power the SIDE A/B "record flip". Real cross-document flip.
  trailingSlash: "never",
  build: {
    inlineStylesheets: "auto",
  },
});
