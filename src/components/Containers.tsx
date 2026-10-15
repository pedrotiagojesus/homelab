import { useGlances } from '../hooks/useGlances'
import { formatBytes } from '../lib/format'
import type { GlancesContainer } from '../types/glances'
import { Loading } from './ui'

function statusVariant(status: string) {
  if (status === 'running') return 'success'
  if (status === 'paused' || status === 'restarting') return 'warning'
  return 'danger'
}

function Containers() {
  const { data } = useGlances<GlancesContainer[]>('containers')
  const containers = [...(data ?? [])].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="card h-100">
      <div className="card-body">
        <h3 className="h6 card-title text-body-secondary mb-3">
          <i className="bi bi-box-seam me-2" />
          Containers {data && <span className="badge text-bg-secondary ms-1">{data.length}</span>}
        </h3>
        {!data ? (
          <Loading />
        ) : (
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0 small">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Estado</th>
                  <th className="text-end">CPU</th>
                  <th className="text-end">Memória</th>
                  <th className="text-end">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {containers.map((c) => (
                  <tr key={c.name}>
                    <td className="fw-semibold" title={c.image.join(', ')}>
                      {c.name}
                    </td>
                    <td>
                      <span className={`badge text-bg-${statusVariant(c.status)}`}>{c.status}</span>
                    </td>
                    <td className="text-end">{c.cpu_percent != null ? `${c.cpu_percent.toFixed(1)}%` : '—'}</td>
                    <td className="text-end">{c.memory_usage != null ? formatBytes(c.memory_usage) : '—'}</td>
                    <td className="text-end text-nowrap">{c.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Containers
