import type { Quotation } from '@/features/quotations/interfaces/quotation'
import { getQuotationSubtotal } from '@/features/quotations/utils/quotationTotals'
import { formatCOP } from '@/lib/money'

export function buildDashboardMetrics(quotations: Quotation[]) {
  const countByStatus = (status: Quotation['status']) =>
    quotations.filter((item) => item.status === status).length

  const pendingFollowUp = quotations.filter(
    (item) => item.status === 'sent' || item.status === 'follow_up'
  ).length

  const quotedValue = quotations.reduce(
    (sum, item) => sum + getQuotationSubtotal(item.items),
    0
  )
  const awardedValue = quotations
    .filter((item) => item.status === 'awarded')
    .reduce((sum, item) => sum + getQuotationSubtotal(item.items), 0)

  return [
    { label: 'Cotizaciones', value: String(quotations.length) },
    { label: 'En elaboración', value: String(countByStatus('draft')) },
    { label: 'En seguimiento', value: String(pendingFollowUp) },
    { label: 'Adjudicadas', value: String(countByStatus('awarded')) },
    { label: 'Valor cotizado', value: formatCOP(quotedValue) },
    { label: 'Valor adjudicado', value: formatCOP(awardedValue) }
  ]
}
