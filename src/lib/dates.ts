export function getTodayIsoDate(reference = new Date()) {
  const year = reference.getFullYear()
  const month = String(reference.getMonth() + 1).padStart(2, '0')
  const day = String(reference.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toUtcDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return Date.UTC(year, (month ?? 1) - 1, day ?? 1)
}

export function formatFollowUpLabel(nextFollowUpAt?: string, todayIso = getTodayIsoDate()) {
  if (!nextFollowUpAt) return '—'

  const days = Math.round(
    (toUtcDate(nextFollowUpAt) - toUtcDate(todayIso)) / 86_400_000
  )

  if (days === 0) return 'Hoy'
  if (days === 1) return 'en 1 día'
  if (days > 1) return `en ${days} días`
  if (days === -1) return 'hace 1 día'
  return `hace ${Math.abs(days)} días`
}

export function addDaysToIsoDate(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate

  const date = new Date(year, month - 1, day + days)
  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0')
  const nextDay = String(date.getDate()).padStart(2, '0')
  return `${nextYear}-${nextMonth}-${nextDay}`
}

export function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(year, month - 1, day))
}

export function formatLetterDate(isoDate: string, city = 'Bogotá D.C.') {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate

  const formatted = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(year, month - 1, day))

  return `${city.toUpperCase()}, ${formatted.toUpperCase()}`
}
