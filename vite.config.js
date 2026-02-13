import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/pqc-readiness-tracker/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three': ['three'],
          'vendor-graph': ['react-force-graph-3d'],
          'vendor-react': ['react', 'react-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1200
  },
});
