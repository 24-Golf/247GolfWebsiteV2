// @ts-check
import { defineConfig } from 'astro/config';

// The production site URL. Used for canonical URLs and the sitemap.
// Cloudflare Pages serves this; DNS is pointed at cutover (see docs/).
export default defineConfig({
  site: 'https://www.24-7golf.com',
});
