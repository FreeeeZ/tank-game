import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from 'vite-plugin-vercel';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@classes': path.resolve(__dirname, './src/classes'),
    },
  },
  plugins: [react(), vercel()],
  server: {
    host: 'localhost',
    port: 3000,
  },
});
