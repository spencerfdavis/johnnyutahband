import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // This passes config directly to SVGR
        icon: true,
      },
    })
  ],
})
