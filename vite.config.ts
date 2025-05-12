import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['i18next-browser-languagedetector'], // Mark i18next browser language detector as external
    },
    outDir: 'build',  // Optional: Customize the output directory (defaults to 'dist')
    sourcemap: true,  // Optional: Generate source maps for debugging
  },
});
