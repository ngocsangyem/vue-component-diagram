import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueComponentDiagram from './dist/index.js';

export default defineConfig({
  plugins: [
    vue(),
    vueComponentDiagram({
      outputPath: 'component-diagram.md',
      includeComposables: true
    })
  ],
  root: './example'
});