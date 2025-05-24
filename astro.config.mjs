// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: "https://foggymtndrifter.com",
  output: "static",

  markdown: {
    syntaxHighlight: "prism",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
