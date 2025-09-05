import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  assetsInclude: ['**/*.svg'], // Treat SVGs as assets
  build: {
    assetsInlineLimit: 0, // Always emit SVG files as assets
  },
});
