import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest-and-icons',
      closeBundle() {
        // Copy manifest
        copyFileSync('manifest.json', 'dist/manifest.json');
        // Copy icons
        if (existsSync('public/icons')) {
          mkdirSync('dist/icons', { recursive: true });
          ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png'].forEach(icon => {
            const src = `public/icons/${icon}`;
            if (existsSync(src)) copyFileSync(src, `dist/icons/${icon}`);
          });
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/index.js'),
        content: resolve(__dirname, 'src/content/index.js'),
        injected: resolve(__dirname, 'src/injected/index.js'),
      },
      output: {
        entryFileNames: (chunk) => {
          // Keep background, content, injected at root level
          if (['background', 'content', 'injected'].includes(chunk.name)) {
            return `${chunk.name}.js`;
          }
          return 'popup/[name].js';
        },
        chunkFileNames: 'popup/chunks/[name]-[hash].js',
        assetFileNames: (asset) => {
          if (asset.name?.endsWith('.html')) return 'popup/[name].[ext]';
          return 'popup/assets/[name]-[hash].[ext]';
        },
      },
    },
    // Don't minify for easier debugging during hackathon
    minify: false,
  },
  define: {
    'process.env.BACKEND_URL': JSON.stringify(
      process.env.VITE_BACKEND_URL || 'http://localhost:3001'
    ),
  },
});
