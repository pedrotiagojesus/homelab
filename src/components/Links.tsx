import { links, resolveUrl } from '../config/links'

function Links() {
  return (
    <section>
      <h2 className="h5 text-body-secondary mb-3">
        <i className="bi bi-link-45deg me-2" />
        Serviços
      </h2>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        {links.map((link) => (
          <div className="col" key={link.name}>
            <a
              href={resolveUrl(link)}
              target="_blank"
              rel="noopener noreferrer"
              className="card h-100 text-decoration-none link-body-emphasis"
            >
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
        ))}
      </div>
    </section>
  )
}

export default Links
