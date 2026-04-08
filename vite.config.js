import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/s3-proxy': {
        target: 'https://s3.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3-proxy/, ''),
      }
    }
  }
});
