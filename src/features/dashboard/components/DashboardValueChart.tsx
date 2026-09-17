import type { ValuePoint } from '@/features/dashboard/utils/buildDashboardMetrics'
import { formatCompactCOP } from '@/lib/money'

export function DashboardValueChart({
  points,
  stroke = '#2563eb',
  emptyLabel = 'No hay valores cotizados en el período.'
}: {
  points: ValuePoint[]
  stroke?: string
  emptyLabel?: string
}) {
  const width = 320
  const height = 120
  const padding = { top: 8, right: 8, bottom: 20, left: 8 }
  const values = points.map((point) => point.value)
  const max = Math.max(...values, 1)
  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom
  const total = values.reduce((sum, value) => sum + value, 0)

  if (points.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">{emptyLabel}</p>
    )
  }

  const coordinates = points.map((point, index) => {
    const x =
      padding.left +
      (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth)
    const y = padding.top + innerHeight - (point.value / max) * innerHeight
    return `${x},${y}`
  })

  const ticks = [0, Math.floor((points.length - 1) / 2), points.length - 1]
    .filter((index, position, list) => list.indexOf(index) === position && points[index])
    .map((index) => {
      const [year, month, day] = points[index].date.split('-').map(Number)
      const label = new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short'
      }).format(new Date(year, month - 1, day))
      const x =
        padding.left +
        (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth)
      return { x, label }
    })

  return (
    <div>
      <p className="text-lg font-semibold">{formatCompactCOP(total)}</p>
      <p className="mb-1 text-[11px] text-muted-foreground">Total en el período</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full">
        {coordinates.length > 0 && (
          <polyline
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            points={coordinates.join(' ')}
          />
        )}
        {ticks.map((tick) => (
          <text
            key={tick.label}
            x={tick.x}
            y={height - 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {tick.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
