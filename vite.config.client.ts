import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => ({
  plugins: [react(), viteSingleFile()],
  root: path.resolve(__dirname, 'src/client'),
  publicDir: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/client'),
    },
  },
  define: {
    __USE_MOCK_GAS__: JSON.stringify(mode === 'development' && process.env.GAS_MOCK !== '0'),
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/client/index.html'),
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
}));
