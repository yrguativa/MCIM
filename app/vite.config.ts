/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Use VITE_BASE environment variable when provided (set by the GitHub Actions workflow)
  // Example for GitHub Pages: VITE_BASE='/my-repo/'
  const base = process.env.VITE_BASE || '/'

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/*.{svg,png}', 'favicon.svg'],
        manifest: {
          name: 'MCIM - Sistema de Gestión',
          short_name: 'MCIM',
          description: 'Sistema de gestión de células, discípulos y ministerios',
          theme_color: '#111827',
          background_color: '#f8fafc',
          display: 'standalone',
          orientation: 'portrait',
          lang: 'es',
          scope: base,
          start_url: base,
          icons: [
            { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
            { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
            { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,json,woff2}'],
          navigateFallback: `${base}index.html`,
          runtimeCaching: [
            {
              urlPattern: /^https?:\/\/.*\/graphql.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  }
})
