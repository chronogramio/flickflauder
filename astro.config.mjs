// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Static build, deployed to Cloudflare Pages via `wrangler pages deploy dist`
// (see .gitlab-ci.yml). No SSR adapter needed for a purely static site.
export default defineConfig({
  site: 'https://flickflauder.com',
  output: 'static',
  integrations: [mdx(), sitemap()],
});
