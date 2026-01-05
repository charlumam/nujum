// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import favicons from "astro-favicons";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://nujum.charda.org",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), favicons(), sitemap()],
});
