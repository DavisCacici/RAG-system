import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    host: true,
    port: 8088,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
});
