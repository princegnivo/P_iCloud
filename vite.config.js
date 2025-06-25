import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-css',
      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          `<link rel="stylesheet" href="/src/styles/apple-fonts.css"></head>`
        );
      }
    }
  ],
  css: {
    postcss: {
      plugins: [tailwindcss]
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
