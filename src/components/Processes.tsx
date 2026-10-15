import { useGlances } from '../hooks/useGlances'
import type { GlancesProcess } from '../types/glances'
import { Loading } from './ui'

function Processes() {
  const { data } = useGlances<GlancesProcess[]>('processlist/top/8')

  return (
    <div className="card h-100">
      <div className="card-body">
        <h3 className="h6 card-title text-body-secondary mb-3">
          <i className="bi bi-list-ol me-2" />
          Top processos
        </h3>
        {!data ? (
          <Loading />
        ) : (
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0 small">
              <thead>
                <tr>
                  <th>Processo</th>
                  <th>Utilizador</th>
                  <th className="text-end">CPU</th>
                  <th className="text-end">Mem</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.pid}>
                    <td className="fw-semibold text-truncate" style={{ maxWidth: 160 }}>
                      {p.name}
                    </td>
                    <td className="text-body-secondary">{p.username}</td>
                    <td className="text-end">{p.cpu_percent.toFixed(1)}%</td>
                    <td className="text-end">{p.memory_percent.toFixed(1)}%</td>
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

export default Processes
