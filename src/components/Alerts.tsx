import { useGlances } from '../hooks/useGlances'
import type { GlancesAlert } from '../types/glances'

const labels: Record<string, [string, string]> = {
  CPU: ['CPU', '%'],
  MEM: ['Memória', '%'],
  MEMSWAP: ['Swap', '%'],
  LOAD: ['Carga', ''],
  FS: ['Disco', '%'],
  SENSORS: ['Temperatura', '°C'],
}

function Alerts() {
  const { data } = useGlances<GlancesAlert[]>('alert', 10000)
  const active = (data ?? []).filter((a) => a.end === -1)
  if (active.length === 0) return null

  return (
    <div className="mb-4">
      {active.map((a) => {
        const [label, unit] = labels[a.type] ?? [a.type, '']
        const critical = a.state === 'CRITICAL'
        return (
          <div
            key={`${a.type}-${a.begin}`}
            className={`alert ${critical ? 'alert-danger' : 'alert-warning'} d-flex align-items-center gap-2 py-2`}
          >
            <i className={`bi ${critical ? 'bi-exclamation-octagon' : 'bi-exclamation-triangle'}`} />
            <span>
              <strong>{label}</strong> em {a.avg.toFixed(1)}
              {unit}
              {a.desc && <span className="text-body-secondary"> · {a.desc}</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default Alerts
