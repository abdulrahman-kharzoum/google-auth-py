import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    port: 3032,
    strictPort: false,
    open: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
