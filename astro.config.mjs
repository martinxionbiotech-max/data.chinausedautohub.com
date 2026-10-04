import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
const site = process.env.DATA_SITE_URL || 'https://data.chinausedautohub.com';
export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: { server: { fs: { allow: ['/home/openclaw/carexport'] } } },
});
