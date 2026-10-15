import type { ServiceLink } from '../types/config'

export function resolveUrl(link: ServiceLink): string {
  if (link.url) return link.url
  const { protocol, hostname } = window.location
  return `${protocol}//${hostname}:${link.port}`
}

// Em modo no-cors a resposta é opaca, mas o fetch só resolve se o serviço respondeu.
export async function isOnline(url: string, signal: AbortSignal): Promise<boolean> {
  try {
    await fetch(url, {
      mode: 'no-cors',
      cache: 'no-store',
      signal: AbortSignal.any([signal, AbortSignal.timeout(4000)]),
    })
    return true
  } catch (err) {
    if (signal.aborted) throw err
    return false
  }
}
