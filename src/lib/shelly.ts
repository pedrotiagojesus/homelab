import type { ShellyDevice } from '../types/config'
import { fetchJson } from './http'

export interface ShellyStatus {
  on: boolean
  power?: number // W
  energyWh?: number // total acumulado
}

function call<T>(device: ShellyDevice, path: string, signal?: AbortSignal): Promise<T> {
  return fetchJson<T>(`/shelly/${device.ip}/${path}`, signal)
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

export async function getShellyStatus(device: ShellyDevice, signal?: AbortSignal): Promise<ShellyStatus> {
  const ch = device.channel ?? 0
  if (device.gen === 1) {
    const s = await call<Gen1Status>(device, 'status', signal)
    const meter = s.meters?.[ch]
    // Gen1 reporta a energia em watt-minuto.
    return { on: s.relays[ch].ison, power: meter?.power, energyWh: meter && meter.total / 60 }
  }
  const s = await call<Gen2SwitchStatus>(device, `rpc/Switch.GetStatus?id=${ch}`, signal)
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
