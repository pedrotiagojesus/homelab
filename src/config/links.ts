// Edita esta lista para adicionar/remover serviços.
// Usa `port` para serviços no mesmo servidor (o host é o mesmo pelo qual a página
// foi aberta) ou `url` para um endereço absoluto.
// Ícones: https://icons.getbootstrap.com/

export interface ServiceLink {
  name: string
  icon: string
  description?: string
  port?: number
  url?: string
}

export const links: ServiceLink[] = [
  { name: 'Terminal', icon: 'bi-terminal', description: 'ttyd', port: 7681 },
  { name: 'Base de dados', icon: 'bi-database', description: 'Adminer', port: 8081 },
  { name: 'Docker', icon: 'bi-box-seam', description: 'Portainer', port: 9000 },
]

export function resolveUrl(link: ServiceLink): string {
  if (link.url) return link.url
  const { protocol, hostname } = window.location
  return `${protocol}//${hostname}:${link.port}`
}
