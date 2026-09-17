export function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value)
}

export function formatCompactCOP(value: number) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)} M`
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)} mil`
  }

  return formatCOP(value)
}
