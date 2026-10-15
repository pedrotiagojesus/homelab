import type { ReactNode } from 'react'
import { percentVariant } from '../lib/format'

export function InfoCard({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="col">
      <div className="card h-100">
        <div className="card-body">
          <h3 className="h6 card-title text-body-secondary mb-3">
            <i className={`bi ${icon} me-2`} />
            {title}
          </h3>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Usage({ percent, label }: { percent: number; label?: string }) {
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between small mb-1">
        <span>{label}</span>
        <span className="fw-semibold">{percent.toFixed(1)}%</span>
      </div>
      <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className={`progress-bar bg-${percentVariant(percent)}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export function Loading() {
  return (
    <p className="placeholder-glow mb-0">
      <span className="placeholder col-8" />
      <span className="placeholder col-6" />
    </p>
  )
}

export function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="d-flex justify-content-between gap-2 small">
      <span className="text-body-secondary text-truncate">{label}</span>
      <span className="text-nowrap">{children}</span>
    </div>
  )
}

export interface SparklineSeries {
  values: number[]
  color: string
}

// Mini-gráfico em SVG. `max` fixa a escala (ex.: 100 para percentagens); sem ele, ajusta ao maior valor.
export function Sparkline({ series, max, height = 32 }: { series: SparklineSeries[]; max?: number; height?: number }) {
  const width = 100
  const top = max ?? Math.max(1, ...series.flatMap((s) => s.values))

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-100 d-block my-2"
      style={{ height }}
      aria-hidden="true"
    >
      {series.map(
        (s, i) =>
          s.values.length > 1 && (
            <polyline
              key={i}
              points={s.values
                .map((v, j) => `${(j / (s.values.length - 1)) * width},${height - 1 - (v / top) * (height - 2)}`)
                .join(' ')}
              fill="none"
              stroke={s.color}
              strokeWidth={1.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ),
      )}
    </svg>
  )
}
