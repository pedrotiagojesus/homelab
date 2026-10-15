import { fetchJson } from '../lib/http'
import type { HomelabConfig } from '../types/config'
import { usePolling } from './usePolling'

async function loadConfig(signal: AbortSignal): Promise<HomelabConfig> {
  const config = await fetchJson<Partial<HomelabConfig>>('/config/config.json', signal)
  return { links: config.links ?? [], shellys: config.shellys ?? [] }
}

// Relê a configuração a cada minuto: alterações em config/config.json aparecem sem rebuild.
export function useConfig() {
  return usePolling(loadConfig, 60000)
}
