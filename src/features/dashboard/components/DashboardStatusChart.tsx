import type { StatusSlice } from '@/features/dashboard/utils/buildDashboardMetrics'

export function DashboardStatusChart({ slices }: { slices: StatusSlice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  const radius = 36
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 96 96" className="-rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          {slices.map((slice) => {
            const percent = total === 0 ? 0 : slice.value / total
            const length = percent * circumference
            const circle = (
              <circle
                key={slice.key}
                cx="48"
                cy="48"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth="12"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            )
            offset += length
            return circle
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold leading-none">{total}</span>
          <span className="text-[10px] text-muted-foreground">Total</span>
        </div>
      </div>
      <ul className="space-y-1.5 text-xs">
        {slices.map((slice) => {
          const percent = total === 0 ? 0 : Math.round((slice.value / total) * 100)
          return (
            <li key={slice.key} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-muted-foreground">{slice.label}</span>
              <span className="ml-auto font-medium">
                {slice.value} ({percent}%)
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
