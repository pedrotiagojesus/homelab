import { useGlances } from '../hooks/useGlances'
import { formatRate } from '../lib/format'
import type { GlancesDiskIo, GlancesGpu, GlancesNetwork, GlancesSensor } from '../types/glances'
import { InfoCard, Loading, Row } from './ui'

// Interfaces virtuais do Docker e loopback não interessam.
const ignoredInterface = /^(lo|veth|br-|docker)/
// Só discos físicos inteiros (sem partições nem loop devices).
const physicalDisk = /^(nvme\d+n\d+|sd[a-z]+|vd[a-z]+|mmcblk\d+|hd[a-z]+)$/

function temperatureClass(sensor: GlancesSensor) {
  // Alguns sensores reportam limites absurdos (ex.: 65261), por isso só se usam valores plausíveis.
  if (sensor.critical && sensor.critical < 150 && sensor.value >= sensor.critical) return 'text-danger'
  if (sensor.warning && sensor.warning < 150 && sensor.value >= sensor.warning) return 'text-warning'
  return ''
}

function ServerActivity() {
  const network = useGlances<GlancesNetwork[]>('network')
  const diskio = useGlances<GlancesDiskIo[]>('diskio')
  const sensors = useGlances<GlancesSensor[]>('sensors', 10000)
  const gpu = useGlances<GlancesGpu[]>('gpu', 10000)

  const interfaces = (network.data ?? []).filter((n) => !ignoredInterface.test(n.interface_name))
  const disks = (diskio.data ?? []).filter((d) => physicalDisk.test(d.disk_name))
  const temps = (sensors.data ?? []).filter((s) => s.type === 'temperature_core')
  const gpus = gpu.data ?? []

  return (
    <section className="mb-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
        <InfoCard icon="bi-ethernet" title="Rede">
          {network.data ? (
            interfaces.map((n) => (
              <Row key={n.interface_name} label={n.interface_name}>
                <i className="bi bi-arrow-down text-success" /> {formatRate(n.bytes_recv_rate_per_sec)}{' '}
                <i className="bi bi-arrow-up text-info ms-1" /> {formatRate(n.bytes_sent_rate_per_sec)}
              </Row>
            ))
          ) : (
            <Loading />
          )}
        </InfoCard>

        <InfoCard icon="bi-hdd" title="I/O dos discos">
          {diskio.data ? (
            disks.map((d) => (
              <Row key={d.disk_name} label={d.disk_name}>
                <i className="bi bi-download" /> {formatRate(d.read_bytes_rate_per_sec)}{' '}
                <i className="bi bi-upload ms-1" /> {formatRate(d.write_bytes_rate_per_sec)}
              </Row>
            ))
          ) : (
            <Loading />
          )}
        </InfoCard>

        {temps.length > 0 && (
          <InfoCard icon="bi-thermometer-half" title="Temperaturas">
            {temps.map((s) => (
              <Row key={s.label} label={s.label}>
                <span className={temperatureClass(s)}>
                  {s.value}°{s.unit}
                </span>
              </Row>
            ))}
          </InfoCard>
        )}

        {gpus.map((g) => (
          <InfoCard key={g.gpu_id} icon="bi-gpu-card" title="GPU">
            <div className="fw-semibold mb-2">{g.name}</div>
            {g.proc != null && <Row label="Utilização">{g.proc}%</Row>}
            {g.mem != null && <Row label="Memória">{g.mem}%</Row>}
            {g.temperature != null && <Row label="Temperatura">{g.temperature}°C</Row>}
          </InfoCard>
        ))}
      </div>
    </section>
  )
}

export default ServerActivity
