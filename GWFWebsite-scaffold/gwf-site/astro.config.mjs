import { defineConfig } from 'astro/config';

// If you later buy a custom domain, set `site` to it and remove `base`.
// For a user/project page at https://zacharyfstthomas.github.io/GWFWebsite/
// we need site + base so links + asset URLs resolve correctly.
export default defineConfig({
  site: 'https://zacharyfstthomas.github.io',
  base: '/GWFWebsite',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
