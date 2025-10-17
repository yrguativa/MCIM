import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import tailwindcss from '@tailwindcss/vite'

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
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  }
})
