// Formato de config/config.json.

export interface ServiceLink {
  name: string
  icon: string
  description?: string
  // `port` para serviços no mesmo servidor (mesmo host pelo qual a página foi aberta)
  // ou `url` para um endereço absoluto.
  port?: number
  url?: string
  // false desativa a verificação online/offline (ex.: HTTPS com certificado self-signed).
  check?: boolean
}

export interface ShellyDevice {
  name: string
  ip: string // tem de ser privado: o nginx só faz proxy para 192.168.x.x, 10.x.x.x e 172.16-31.x.x
  gen: 1 | 2 // 1 para modelos antigos, 2 para Plus/Pro/Gen3/Gen4
  channel?: number
  icon?: string
}

export interface HomelabConfig {
  links: ServiceLink[]
  shellys: ShellyDevice[]
}
