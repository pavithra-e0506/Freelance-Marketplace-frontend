import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'freelance-marketplace-frontend.onrender.com',
      'localhost'
    ],
    host: '0.0.0.0',
    port: 4173
  },
  preview: {
    allowedHosts: [
      'freelance-marketplace-frontend.onrender.com',
      'localhost'
    ],
    host: '0.0.0.0',
    port: 4173
  }
})