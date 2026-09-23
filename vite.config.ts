import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js'],
    },
    server: {
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : { usePolling: true },
      // Proxy Supabase REST API to local PostgREST (single-origin dev setup)
      proxy: {
        '/rest/v1': {
          target: 'http://postgrest:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/rest\/v1/, ''),
          configure: (proxy) => {
            // Strip Supabase auth headers — local PostgREST has no JWT secret
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('authorization');
              proxyReq.removeHeader('apikey');
            });
          },
        },
      },
    },
  };
});
