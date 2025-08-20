import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/store_ratings_starter/',
  plugins: [react()],
  server: { port: 5173 },
})
