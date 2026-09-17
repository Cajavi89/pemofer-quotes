import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { DashboardKpi } from '@/features/dashboard/utils/buildDashboardMetrics'
import { cn } from '@/lib/utils'

const iconStyles: Record<DashboardKpi['key'], string> = {
  total: 'bg-sky-50 text-sky-600',
  followUp: 'bg-amber-50 text-amber-600',
  awarded: 'bg-emerald-50 text-emerald-600',
  lost: 'bg-rose-50 text-rose-600'
}

export function DashboardKpiCard({
  kpi,
  icon: Icon
}: {
  kpi: DashboardKpi
  icon: LucideIcon
}) {
  const isPositive = kpi.changePercent > 0
  const isNegative = kpi.changePercent < 0

  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-3">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            iconStyles[kpi.key]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
          <p className="text-lg font-semibold leading-tight">{kpi.value}</p>
          <p
            className={cn(
              'text-[11px]',
              isPositive && 'text-emerald-600',
              isNegative && 'text-rose-600',
              !isPositive && !isNegative && 'text-muted-foreground'
            )}
          >
            {isPositive ? '+' : ''}
            {kpi.changePercent}% vs. mes anterior
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
