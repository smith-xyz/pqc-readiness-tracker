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
          'vendor-graph': ['cytoscape', 'cytoscape-dagre'],
          'vendor-react': ['react', 'react-dom']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
});

