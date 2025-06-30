// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy /convert to localhost:3000
      '/sketch': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});

