import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    postcss: {
      plugins: [] // This forces Vite to ignore external/parent PostCSS configs
    }
  },
  server: {
    port: 5174,
  },
})