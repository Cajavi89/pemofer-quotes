import type { QuotationStatus } from '@/features/quotations/interfaces/quotation'

export const QUOTATION_STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: 'En elaboración',
  sent: 'Enviada',
  follow_up: 'En seguimiento',
  awarded: 'Adjudicada',
  lost: 'Perdida',
  expired: 'Vencida'
}
