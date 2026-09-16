import { Badge } from '@/components/ui/badge'
import { QUOTATION_STATUS_LABELS } from '@/features/quotations/constants/quotationStatus'
import type { QuotationStatus } from '@/features/quotations/interfaces/quotation'
import { cn } from '@/lib/utils'

const statusStyles: Record<QuotationStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  sent: 'bg-sky-100 text-sky-800 hover:bg-sky-100',
  follow_up: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  awarded: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  lost: 'bg-rose-100 text-rose-800 hover:bg-rose-100',
  expired: 'bg-zinc-200 text-zinc-700 hover:bg-zinc-200'
}

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
  return (
    <Badge className={cn('border-0 font-medium', statusStyles[status])}>
      {QUOTATION_STATUS_LABELS[status]}
    </Badge>
  )
}
