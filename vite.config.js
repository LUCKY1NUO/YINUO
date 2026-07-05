import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

const removeCrossorigin = () => ({
  name: 'remove-crossorigin-attrs',
  enforce: 'post',
  transformIndexHtml(html) {
    return html.replace(/\s+crossorigin(?:="[^"]*")?/g, '');
  },
});

export default defineConfig({
  plugins: [
    legacy({
      targets: ['iOS >= 12', 'Safari >= 12'],
      modernPolyfills: true,
    }),
    removeCrossorigin(),
  ],
  build: {
    modulePreload: false,
  },
});
