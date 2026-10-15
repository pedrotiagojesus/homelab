import { useCallback } from 'react'
import { usePolling } from '../hooks/usePolling'
import { isOnline, resolveUrl } from '../lib/links'
import type { ServiceLink } from '../types/config'
import { Loading } from './ui'

function StatusDot({ url }: { url: string }) {
  const fetcher = useCallback((signal: AbortSignal) => isOnline(url, signal), [url])
  const { data: online } = usePolling(fetcher, 30000)
  const [color, label] =
    online == null ? ['secondary', 'A verificar'] : online ? ['success', 'Online'] : ['danger', 'Offline']

  return (
    <span
      className={`position-absolute top-0 end-0 m-2 rounded-circle bg-${color}`}
      style={{ width: 10, height: 10 }}
      title={label}
      aria-label={label}
      role="status"
    />
  )
}

function Links({ links }: { links?: ServiceLink[] }) {
  return (
    <section>
      <h2 className="h5 text-body-secondary mb-3">
        <i className="bi bi-link-45deg me-2" />
        Serviços
      </h2>
      {!links ? (
        <Loading />
      ) : (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
          {links.map((link) => {
            const url = resolveUrl(link)
            return (
              <div className="col" key={link.name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card h-100 text-decoration-none link-body-emphasis"
                >
                  {link.check !== false && <StatusDot url={url} />}
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className={`bi ${link.icon} fs-2 text-primary`} />
                    <div>
                      <div className="fw-semibold">{link.name}</div>
                      {link.description && (
                        <div className="small text-body-secondary">{link.description}</div>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Links
