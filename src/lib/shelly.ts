import type { ShellyDevice } from '../config/shellys'

export interface ShellyStatus {
  on: boolean
  power?: number // W
  energyWh?: number // total acumulado
}

async function call<T>(device: ShellyDevice, path: string): Promise<T> {
  const res = await fetch(`/shelly/${device.ip}/${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as T
}

interface Gen1Status {
  relays: { ison: boolean }[]
  meters?: { power: number; total: number }[]
}

interface Gen2SwitchStatus {
  output: boolean
  apower?: number
  aenergy?: { total: number }
}

export async function getShellyStatus(device: ShellyDevice): Promise<ShellyStatus> {
  const ch = device.channel ?? 0
  if (device.gen === 1) {
    const s = await call<Gen1Status>(device, 'status')
    const meter = s.meters?.[ch]
    // Gen1 reporta a energia em watt-minuto.
    return { on: s.relays[ch].ison, power: meter?.power, energyWh: meter && meter.total / 60 }
  }
  const s = await call<Gen2SwitchStatus>(device, `rpc/Switch.GetStatus?id=${ch}`)
  return { on: s.output, power: s.apower, energyWh: s.aenergy?.total }
}

export async function setShellyOn(device: ShellyDevice, on: boolean): Promise<void> {
  const ch = device.channel ?? 0
  if (device.gen === 1) {
    await call(device, `relay/${ch}?turn=${on ? 'on' : 'off'}`)
  } else {
    await call(device, `rpc/Switch.Set?id=${ch}&on=${on}`)
  }
}
