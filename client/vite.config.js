import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server on port 5173. API calls use the baseURL from .env directly
// (CORS is allowed by the back-end), so no proxy is configured here.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
})
