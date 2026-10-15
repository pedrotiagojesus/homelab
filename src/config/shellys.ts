// Dispositivos Shelly mostrados na secção "Casa".
// `gen`: 1 para modelos antigos (Shelly 1, Plug S, ...), 2 para Plus/Pro/Gen3/Gen4.
// `channel`: número do relé em dispositivos com vários canais (por omissão 0).
// O IP tem de ser privado (192.168.x.x, 10.x.x.x, 172.16-31.x.x) — o nginx só faz proxy para esses.
// Ícones: https://icons.getbootstrap.com/

export interface ShellyDevice {
  name: string
  ip: string
  gen: 1 | 2
  channel?: number
  icon?: string
}

export const shellys: ShellyDevice[] = [
  // { name: 'Candeeiro da sala', ip: '192.168.1.50', gen: 2, icon: 'bi-lightbulb' },
  // { name: 'Tomada do servidor', ip: '192.168.1.51', gen: 1, icon: 'bi-plug' },
]
