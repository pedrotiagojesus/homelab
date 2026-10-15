import { useGlances } from '../hooks/useGlances'
import { formatBytes, formatHz } from '../lib/format'
import type {
  GlancesCpu,
  GlancesFs,
  GlancesIp,
  GlancesLoad,
  GlancesMem,
  GlancesProcessCount,
  GlancesQuicklook,
  GlancesSwap,
  GlancesSystem,
} from '../types/glances'
import { InfoCard, Loading, Row, Usage } from './ui'

// O Glances corre num container: vê bind-mounts (/etc/hosts, ...) e a raiz do host em /rootfs.
// Fica uma entrada por dispositivo, preferindo a de /rootfs, com o caminho real do host.
function hostDisks(entries: GlancesFs[]) {
  const byDevice = new Map<string, GlancesFs>()
  for (const disk of entries) {
    const current = byDevice.get(disk.device_name)
    if (!current || disk.mnt_point.startsWith('/rootfs')) byDevice.set(disk.device_name, disk)
  }
  return [...byDevice.values()].map((disk) => ({
    ...disk,
    label: disk.mnt_point.startsWith('/rootfs')
      ? disk.mnt_point.slice('/rootfs'.length) || '/'
      : disk.device_name,
  }))
}

function ServerInfo() {
  const system = useGlances<GlancesSystem>('system', 60000)
  const uptime = useGlances<string>('uptime', 60000)
  const ip = useGlances<GlancesIp>('ip', 60000)
  const procs = useGlances<GlancesProcessCount>('processcount')
  const quicklook = useGlances<GlancesQuicklook>('quicklook')
  const cpu = useGlances<GlancesCpu>('cpu')
  const load = useGlances<GlancesLoad>('load')
  const mem = useGlances<GlancesMem>('mem')
  const swap = useGlances<GlancesSwap>('memswap')
  const fs = useGlances<GlancesFs[]>('fs', 30000)

  const offline = system.error && cpu.error && mem.error

  return (
    <section className="mb-4">
      {offline && (
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle" />
          Glances indisponível — não foi possível obter a informação do servidor.
        </div>
      )}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
        <InfoCard icon="bi-hdd-rack" title="Sistema">
          {system.data ? (
            <>
              <div className="fs-5 fw-semibold text-truncate">{system.data.hostname}</div>
              <div className="small text-body-secondary mb-2">
                {system.data.linux_distro || system.data.os_name}
              </div>
              <Row label="Kernel">{system.data.os_version}</Row>
              {ip.data && (
                <Row label="IP">
                  {ip.data.address}/{ip.data.mask_cidr}
                </Row>
              )}
              {uptime.data && <Row label="Uptime">{uptime.data}</Row>}
              {procs.data && (
                <Row label="Processos">
                  {procs.data.total} ({procs.data.thread} threads)
                </Row>
              )}
            </>
          ) : (
            <Loading />
          )}
        </InfoCard>

        <InfoCard icon="bi-cpu" title="CPU">
          {cpu.data ? (
            <>
              {quicklook.data && (
                <div className="small text-body-secondary text-truncate mb-2" title={quicklook.data.cpu_name}>
                  {quicklook.data.cpu_name}
                </div>
              )}
              <Usage percent={cpu.data.total} label="Utilização" />
              {quicklook.data && (
                <>
                  <div className="d-flex gap-1 mb-2" style={{ height: 24 }} title="Utilização por core">
                    {quicklook.data.percpu.map((core) => (
                      <div key={core.cpu_number} className="flex-fill bg-body-tertiary rounded-1 d-flex align-items-end">
                        <div className="w-100 bg-primary rounded-1" style={{ height: `${core.total}%` }} />
                      </div>
                    ))}
                  </div>
                  <Row label="Frequência">{formatHz(quicklook.data.cpu_hz_current)}</Row>
                </>
              )}
              {load.data && (
                <Row label={`Load (${load.data.cpucore} cores)`}>
                  {load.data.min1.toFixed(2)} / {load.data.min5.toFixed(2)} / {load.data.min15.toFixed(2)}
                </Row>
              )}
            </>
          ) : (
            <Loading />
          )}
        </InfoCard>

        <InfoCard icon="bi-memory" title="Memória">
          {mem.data ? (
            <>
              <Usage percent={mem.data.percent} label="RAM" />
              <div className="small text-body-secondary mb-3">
                {formatBytes(mem.data.used)} / {formatBytes(mem.data.total)}
              </div>
              {swap.data && swap.data.total > 0 && (
                <>
                  <Usage percent={swap.data.percent} label="Swap" />
                  <div className="small text-body-secondary">
                    {formatBytes(swap.data.used)} / {formatBytes(swap.data.total)}
                  </div>
                </>
              )}
            </>
          ) : (
            <Loading />
          )}
        </InfoCard>

        <InfoCard icon="bi-device-hdd" title="Disco">
          {fs.data ? (
            hostDisks(fs.data).map((disk) => (
              <div key={disk.device_name} className="mb-2">
                <Usage percent={disk.percent} label={disk.label} />
                <div className="small text-body-secondary">
                  {formatBytes(disk.used)} / {formatBytes(disk.size)}
                </div>
              </div>
            ))
          ) : (
            <Loading />
          )}
        </InfoCard>
      </div>
    </section>
  )
}

export default ServerInfo
