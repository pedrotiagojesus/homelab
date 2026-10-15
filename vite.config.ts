import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'

// Em desenvolvimento serve config/config.json (ou o exemplo, se ainda não existir),
// tal como o nginx faz em produção a partir do volume montado.
function serveConfig(): Plugin {
  return {
    name: 'serve-config',
    configureServer(server) {
      server.middlewares.use('/config/config.json', (_req, res) => {
        const file = existsSync('config/config.json') ? 'config/config.json' : 'config/config.example.json'
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.end(readFileSync(file))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveConfig()],
  server: {
    // Em desenvolvimento, encaminha /api para o Glances (ex.: GLANCES_URL=http://servidor:61208)
    proxy: {
      '/api': process.env.GLANCES_URL ?? 'http://localhost:61208',
    },
  },
})
