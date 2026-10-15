// Tipos mínimos das respostas da API v4 do Glances que são usadas na página.

export interface GlancesSystem {
  hostname: string
  os_name: string
  os_version: string
  linux_distro?: string
  platform: string
}

export interface GlancesCpu {
  total: number
  cpucore?: number
}

export interface GlancesLoad {
  min1: number
  min5: number
  min15: number
  cpucore: number
}

export interface GlancesMem {
  total: number
  used: number
  percent: number
}

export interface GlancesFs {
  device_name: string
  fs_type: string
  mnt_point: string
  size: number
  used: number
  percent: number
}

export interface GlancesSensor {
  label: string
  value: number
  unit: string
  type: string
  warning: number | null
  critical: number | null
}

export interface GlancesQuicklook {
  cpu_name: string
  cpu_hz_current: number
  cpu_hz: number
  percpu: { cpu_number: number; total: number }[]
}

export interface GlancesSwap {
  total: number
  used: number
  percent: number
}

export interface GlancesIp {
  address: string
  mask_cidr: number
}

export interface GlancesProcessCount {
  total: number
  running: number
  sleeping: number
  thread: number
}

export interface GlancesNetwork {
  interface_name: string
  bytes_recv_rate_per_sec: number
  bytes_sent_rate_per_sec: number
}

export interface GlancesDiskIo {
  disk_name: string
  read_bytes_rate_per_sec: number
  write_bytes_rate_per_sec: number
}

export interface GlancesGpu {
  gpu_id: string
  name: string
  proc: number | null
  mem: number | null
  temperature: number | null
}

export interface GlancesContainer {
  name: string
  status: string
  image: string[]
  uptime: string
  cpu_percent: number | null
  memory_usage: number | null
}

export interface GlancesProcess {
  pid: number
  name: string
  username: string
  cpu_percent: number
  memory_percent: number
}

export interface GlancesAlert {
  begin: number
  end: number // -1 enquanto o alerta está ativo
  state: string // WARNING | CRITICAL
  type: string // MEM, CPU, LOAD, FS, MEMSWAP, SENSORS, ...
  avg: number
  max: number
  desc: string
}
