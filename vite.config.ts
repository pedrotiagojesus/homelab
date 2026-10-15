import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Em desenvolvimento, encaminha /api para o Glances (ex.: GLANCES_URL=http://servidor:61208)
    proxy: {
      '/api': process.env.GLANCES_URL ?? 'http://localhost:61208',
    },
  },
})
