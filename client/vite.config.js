import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import imageSizes from './scripts/image-sizes-plugin.mjs';

// The project-root .env (never committed). ONLY the public Turnstile site key is read from it, and only it
// reaches the client (as import.meta.env.VITE_TURNSTILE_SITE_KEY). Secrets (EMAIL_PASS, TURNSTILE_SECRET_KEY)
// are never loaded here. An environment variable of the same name takes priority (e.g. on the build host).
const ROOT = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig(({ isSsrBuild, mode }) => {
  const { TURNSTILE_SITE_KEY = '' } = loadEnv(mode, ROOT, 'TURNSTILE_SITE_KEY');
  return {
    plugins: [react(), imageSizes()],
    define: { 'import.meta.env.VITE_TURNSTILE_SITE_KEY': JSON.stringify(TURNSTILE_SITE_KEY) },
    build: isSsrBuild
      ? { assetsInlineLimit: 0 }
      : {
          cssCodeSplit: false,
          // Always emit images as files so they get cacheable, absolute URLs (SEO/OG).
          assetsInlineLimit: 0,
          rollupOptions: {
            output: {
              // Split the framework from app code for long-term caching.
              manualChunks(id) {
                if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|@remix-run)\//.test(id)) return 'vendor';
              },
            },
          },
        },
    server: {
      // /api → the Node server (PORT, 3001 by default) in development; in production the Node server serves both.
      proxy: { '/api': `http://localhost:${process.env.PORT || 3001}` },
    },
  };
});
