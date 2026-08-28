import { defineConfig } from 'astro/config';

// Served from the root of a custom domain, so no `base` is needed.
// DNS sits behind Cloudflare's proxy in front of GitHub Pages; the
// CNAME file in public/ is what keeps Pages bound to the domain
// across deploys.
export default defineConfig({
  site: 'https://gamecockwrestlingfoundation.org',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
