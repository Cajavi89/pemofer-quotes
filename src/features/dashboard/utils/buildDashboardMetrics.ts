import type { Quotation } from '@/features/quotations/interfaces/quotation'
import { getQuotationSubtotal } from '@/features/quotations/utils/quotationTotals'

export const DASHBOARD_RECENT_LIMIT = 5

export interface MonthPeriod {
  year: number
  month: number
}

export interface DashboardKpi {
  key: 'total' | 'followUp' | 'awarded' | 'lost'
  label: string
  value: number
  previousValue: number
  changePercent: number
}

export interface StatusSlice {
  key: string
  label: string
  value: number
  color: string
}

export interface ValuePoint {
  date: string
  value: number
}

function parseIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return { year, month, day }
}

export function getMonthPeriod(referenceDate: Date): MonthPeriod {
  return {
    year: referenceDate.getFullYear(),
    month: referenceDate.getMonth() + 1
  }
}

export function toMonthKey(period: MonthPeriod) {
  return `${period.year}-${String(period.month).padStart(2, '0')}`
}

export function parseMonthKey(value?: string | null): MonthPeriod | null {
  if (!value) return null

  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  if (!Number.isInteger(year) || month < 1 || month > 12) return null

  return { year, month }
}

export function isFuturePeriod(period: MonthPeriod, currentPeriod: MonthPeriod) {
  return (
    period.year > currentPeriod.year ||
    (period.year === currentPeriod.year && period.month > currentPeriod.month)
  )
}

export function clampDashboardPeriod(
  period: MonthPeriod,
  currentPeriod: MonthPeriod
): MonthPeriod {
  return isFuturePeriod(period, currentPeriod) ? currentPeriod : period
}

export function resolveDashboardPeriod(
  monthParam?: string | null,
  referenceDate = new Date()
): MonthPeriod {
  const currentPeriod = getMonthPeriod(referenceDate)
  const parsed = parseMonthKey(monthParam)

  return parsed ? clampDashboardPeriod(parsed, currentPeriod) : currentPeriod
}

export function addMonths(period: MonthPeriod, count: number): MonthPeriod {
  const date = new Date(period.year, period.month - 1 + count, 1)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1
  }
}

export function getPreviousMonth(period: MonthPeriod): MonthPeriod {
  return addMonths(period, -1)
}

export function formatMonthName(month: number) {
  const label = new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(
    new Date(2026, month - 1, 1)
  )

  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatMonthLabel(period: MonthPeriod) {
  return `${formatMonthName(period.month)} de ${period.year}`
}

export const DASHBOARD_CALENDAR_MONTHS = Array.from({ length: 12 }, (_, index) => {
  const month = index + 1
  return { value: month, label: formatMonthName(month) }
})

export function lastSelectableMonth(year: number, currentPeriod: MonthPeriod) {
  if (year < currentPeriod.year) return 12
  if (year === currentPeriod.year) return currentPeriod.month
  return 0
}

export function listDashboardMonths(year: number, currentPeriod: MonthPeriod) {
  const lastMonth = lastSelectableMonth(year, currentPeriod)
  return DASHBOARD_CALENDAR_MONTHS.filter((month) => month.value <= lastMonth)
}

export function listDashboardYears(currentYear: number, selectedYear: number) {
  const startYear = currentYear - 4
  const years: number[] = []

  for (let year = currentYear; year >= startYear; year -= 1) {
    years.push(year)
  }

  if (selectedYear <= currentYear && !years.includes(selectedYear)) {
    years.push(selectedYear)
    years.sort((left, right) => right - left)
  }

  return years
}

export function formatPeriodRange(period: MonthPeriod) {
  const lastDayOfMonth = new Date(period.year, period.month, 0).getDate()
  const month = String(period.month).padStart(2, '0')
  return `${month}/01/${period.year} – ${month}/${String(lastDayOfMonth).padStart(2, '0')}/${period.year}`
}

export function isInMonth(isoDate: string, period: MonthPeriod) {
  const parsed = parseIsoDate(isoDate)
  return parsed.year === period.year && parsed.month === period.month
}

function isFollowUp(quotation: Quotation) {
  return quotation.status === 'sent' || quotation.status === 'follow_up'
}

function summarize(quotations: Quotation[]) {
  return {
    total: quotations.length,
    followUp: quotations.filter(isFollowUp).length,
    awarded: quotations.filter((item) => item.status === 'awarded').length,
    lost: quotations.filter((item) => item.status === 'lost').length
  }
}

export function getChangePercent(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }

  return Math.round(((current - previous) / previous) * 100)
}

export function buildDashboardKpis(
  currentQuotations: Quotation[],
  previousQuotations: Quotation[]
): DashboardKpi[] {
  const current = summarize(currentQuotations)
  const previous = summarize(previousQuotations)

  return [
    {
      key: 'total',
      label: 'Cotizaciones totales',
      value: current.total,
      previousValue: previous.total,
      changePercent: getChangePercent(current.total, previous.total)
    },
    {
      key: 'followUp',
      label: 'En seguimiento',
      value: current.followUp,
      previousValue: previous.followUp,
      changePercent: getChangePercent(current.followUp, previous.followUp)
    },
    {
      key: 'awarded',
      label: 'Adjudicadas',
      value: current.awarded,
      previousValue: previous.awarded,
      changePercent: getChangePercent(current.awarded, previous.awarded)
    },
    {
      key: 'lost',
      label: 'Perdidas',
      value: current.lost,
      previousValue: previous.lost,
      changePercent: getChangePercent(current.lost, previous.lost)
    }
  ]
}

export function buildStatusSlices(quotations: Quotation[]): StatusSlice[] {
  return [
    {
      key: 'draft',
      label: 'En elaboración',
      value: quotations.filter((item) => item.status === 'draft').length,
      color: '#64748b'
    },
    {
      key: 'followUp',
      label: 'En seguimiento',
      value: quotations.filter(isFollowUp).length,
      color: '#d97706'
    },
    {
      key: 'awarded',
      label: 'Adjudicadas',
      value: quotations.filter((item) => item.status === 'awarded').length,
      color: '#059669'
    },
    {
      key: 'lost',
      label: 'Perdidas',
      value: quotations.filter((item) => item.status === 'lost').length,
      color: '#e11d48'
    }
  ]
}

export function buildValueSeries(
  quotations: Quotation[],
  period: MonthPeriod
): ValuePoint[] {
  const lastDayOfMonth = new Date(period.year, period.month, 0).getDate()

  const totals = new Map<string, number>()
  for (const quotation of quotations) {
    const current = totals.get(quotation.date) ?? 0
    totals.set(quotation.date, current + getQuotationSubtotal(quotation.items))
  }

  const points: ValuePoint[] = []
  for (let day = 1; day <= lastDayOfMonth; day += 1) {
    const date = `${period.year}-${String(period.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const value = totals.get(date) ?? 0
    if (value > 0) {
      points.push({ date, value })
    }
  }

  return points
}

export function getRecentQuotations(quotations: Quotation[]) {
  return [...quotations]
    .sort((a, b) => {
      const created = b.createdAt.localeCompare(a.createdAt)
      if (created !== 0) return created
      return b.date.localeCompare(a.date)
    })
    .slice(0, DASHBOARD_RECENT_LIMIT)
}
