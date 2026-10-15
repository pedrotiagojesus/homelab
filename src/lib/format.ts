const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

export function formatBytes(bytes: number): string {
  let value = bytes
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function percentVariant(percent: number): string {
  if (percent < 70) return 'success'
  if (percent < 90) return 'warning'
  return 'danger'
}

export function formatRate(bytesPerSec: number): string {
  return `${formatBytes(bytesPerSec)}/s`
}

export function formatHz(hz: number): string {
  return `${(hz / 1e9).toFixed(2)} GHz`
}
