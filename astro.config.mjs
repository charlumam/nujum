import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import favicons from "astro-favicons";

export default defineConfig({
  site: "https://nujum.charda.org",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), favicons(), sitemap()],
  adapter: cloudflare(),
});
