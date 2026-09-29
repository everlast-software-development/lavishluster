import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
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
    proxy: { '/api': 'http://localhost:3001' },
  },
}));
