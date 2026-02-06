import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  },
  // .env nastaana he sarvottam solution aahe
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify('https://dubaip2p.onrender.com')
    }
  }
})