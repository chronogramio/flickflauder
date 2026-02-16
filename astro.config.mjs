// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://flickflauder.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [mdx(), sitemap()],
});
