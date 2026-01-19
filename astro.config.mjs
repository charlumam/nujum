import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import clerk from "@clerk/astro";
import cloudflare from "@astrojs/cloudflare";
import favicons from "astro-favicons";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://nujum.charda.org",
  output: "server",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), favicons(), sitemap(), clerk()],
  adapter: cloudflare(),
});
