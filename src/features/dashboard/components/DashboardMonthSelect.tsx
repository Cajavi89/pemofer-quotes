'use client'

import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  lastSelectableMonth,
  listDashboardMonths,
  listDashboardYears,
  type MonthPeriod,
  toMonthKey
} from '@/features/dashboard/utils/buildDashboardMetrics'
import { routes } from '@/constants/routes'

export function DashboardMonthSelect({
  selectedPeriod,
  currentPeriod
}: {
  selectedPeriod: MonthPeriod
  currentPeriod: MonthPeriod
}) {
  const router = useRouter()
  const years = listDashboardYears(currentPeriod.year, selectedPeriod.year)
  const months = listDashboardMonths(selectedPeriod.year, currentPeriod)
  const currentMonthKey = toMonthKey(currentPeriod)

  function navigate(month: number, year: number) {
    const nextMonth = Math.min(month, lastSelectableMonth(year, currentPeriod) || 1)
    const nextKey = toMonthKey({ year, month: nextMonth })

    if (nextKey === currentMonthKey) {
      router.replace(routes.dashboard)
      return
    }

    router.replace(`${routes.dashboard}?month=${nextKey}`)
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="space-y-1">
        <Label htmlFor="dashboard-month">Mes</Label>
        <Select
          value={String(selectedPeriod.month)}
          onValueChange={(value) =>
            navigate(Number(value), selectedPeriod.year)
          }
        >
          <SelectTrigger id="dashboard-month" className="w-[150px]">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={String(month.value)}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="dashboard-year">Año</Label>
        <Select
          value={String(selectedPeriod.year)}
          onValueChange={(value) =>
            navigate(selectedPeriod.month, Number(value))
          }
        >
          <SelectTrigger id="dashboard-year" className="w-[100px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
