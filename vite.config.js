import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // In dev, we'll handle this differently
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy error (expected in dev):', err.message);
          });
        }
      }
    }
  }
})
