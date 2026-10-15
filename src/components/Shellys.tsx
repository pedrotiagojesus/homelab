import { useCallback, useState } from 'react'
import { usePolling } from '../hooks/usePolling'
import { getShellyStatus, setShellyOn } from '../lib/shelly'
import type { ShellyDevice } from '../types/config'
import { Loading } from './ui'

function ShellyCard({ device }: { device: ShellyDevice }) {
  const fetcher = useCallback((signal: AbortSignal) => getShellyStatus(device, signal), [device])
  const { data: status, error, refresh } = usePolling(fetcher, 5000)
  const [busy, setBusy] = useState(false)
  const [toggleError, setToggleError] = useState(false)

  async function toggle() {
    if (!status) return
    setBusy(true)
    try {
      await setShellyOn(device, !status.on)
      setToggleError(false)
      refresh()
    } catch {
      setToggleError(true)
    } finally {
      setBusy(false)
    }
  }

  const on = status?.on ?? false
  const offline = error || toggleError

  return (
    <div className="col">
      <div className={`card h-100 ${on ? 'border-warning' : ''}`}>
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <i className={`bi ${device.icon ?? 'bi-toggle-on'} fs-2 ${on ? 'text-warning' : 'text-body-secondary'}`} />
            <div className="flex-fill text-truncate">
              <div className="fw-semibold text-truncate">{device.name}</div>
              <div className="small text-body-secondary">{device.ip}</div>
            </div>
            <div className="form-check form-switch fs-4 mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                aria-label={`Ligar/desligar ${device.name}`}
                checked={on}
                disabled={!status || busy || !!error}
                onChange={toggle}
              />
            </div>
          </div>
          <div className="mt-2 small">
            {offline ? (
              <span className="text-danger">
                <i className="bi bi-wifi-off me-1" />
                Sem ligação
              </span>
            ) : !status ? (
              <Loading />
            ) : status.power != null ? (
              <span className="text-body-secondary">
                <i className="bi bi-lightning-charge me-1" />
                {status.power.toFixed(1)} W
                {status.energyWh != null && ` · ${(status.energyWh / 1000).toFixed(2)} kWh`}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function Shellys({ devices }: { devices?: ShellyDevice[] }) {
  return (
    <section className="mb-5">
      <h2 className="h5 text-body-secondary mb-3">
        <i className="bi bi-house me-2" />
        Casa
      </h2>
      {!devices ? (
        <Loading />
      ) : devices.length === 0 ? (
        <div className="card" style={{ borderStyle: 'dashed' }}>
          <div className="card-body text-center text-body-secondary py-4">
            <i className="bi bi-plug fs-2 d-block mb-2" />
            Ainda não há dispositivos Shelly configurados.
            <div className="small mt-1">
              Adiciona-os em <code>config/config.json</code>.
            </div>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {devices.map((device) => (
            <ShellyCard key={`${device.ip}-${device.channel ?? 0}`} device={device} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Shellys
