import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/vision': {
        target: 'https://vision.googleapis.com/v1/images:annotate',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vision/, ''),
      },
    }
  },
})
