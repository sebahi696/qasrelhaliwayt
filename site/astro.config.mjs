import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://qasralhalaweyat.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory', assets: '_assets' },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', ar: 'ar' } } })],
  compressHTML: true,
});
