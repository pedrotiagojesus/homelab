import { useState } from 'react'
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

const timeFormat = new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' })

const alertKey = (a: GlancesAlert) => `${a.type}-${a.begin}`

// Alertas ativos do Glances como toasts no canto inferior direito.
// Um toast fechado só volta a aparecer se o Glances abrir um alerta novo.
function Alerts() {
  const { data } = useGlances<GlancesAlert[]>('alert', 10000)
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set())

  const active = (data ?? []).filter((a) => a.end === -1 && !dismissed.has(alertKey(a)))

  function dismiss(key: string) {
    setDismissed((prev) => new Set(prev).add(key))
  }

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      {active.map((a) => {
        const [label, unit] = labels[a.type] ?? [a.type, '']
        const critical = a.state === 'CRITICAL'
        const key = alertKey(a)
        return (
          <div
            key={key}
            className={`toast show border-${critical ? 'danger' : 'warning'}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <i
                className={`bi ${critical ? 'bi-exclamation-octagon text-danger' : 'bi-exclamation-triangle text-warning'} me-2`}
              />
              <strong className="me-auto">{label}</strong>
              <small className="text-body-secondary">desde {timeFormat.format(a.begin * 1000)}</small>
              <button type="button" className="btn-close ms-2" aria-label="Fechar" onClick={() => dismiss(key)} />
            </div>
            <div className="toast-body">
              {critical ? 'Crítico' : 'Aviso'}: {a.avg.toFixed(1)}
              {unit} (máx. {a.max.toFixed(1)}
              {unit}){a.desc && ` · ${a.desc}`}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Alerts
