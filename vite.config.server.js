import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import viteExposeGasFunctions from './vite-plugins/gas-expose.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => ({
  plugins: [
    viteExposeGasFunctions(),
    viteStaticCopy({
      targets: [{ src: 'appsscript.json', dest: '.', rename: { stripBase: true } }],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    minify: mode !== 'development',
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'app',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'code.js',
      },
    },
  },
}));
