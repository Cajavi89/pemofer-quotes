import { cn } from '@/lib/utils'
import { formatCOP } from '@/lib/money'
import {
  getQuotationAmounts,
  VAT_PERCENT
} from '@/features/quotations/utils/quotationTotals'

export function QuotationTotals({
  items,
  includeVat,
  align = 'start'
}: {
  items: Array<{ quantity: number; unitPrice: number }>
  includeVat: boolean
  align?: 'start' | 'end'
}) {
  const { subtotal, vatAmount, total } = getQuotationAmounts(items, includeVat)

  return (
    <div
      className={cn(
        'space-y-1',
        align === 'end' && 'text-right'
      )}
    >
      {includeVat ? (
        <>
          <div
            className={cn(
              'flex items-baseline gap-3',
              align === 'end' && 'justify-end'
            )}
          >
            <p className="text-sm text-muted-foreground">Subtotal</p>
            <p className="font-medium tabular-nums">{formatCOP(subtotal)}</p>
          </div>
          <div
            className={cn(
              'flex items-baseline gap-3',
              align === 'end' && 'justify-end'
            )}
          >
            <p className="text-sm text-muted-foreground">
              IVA ({VAT_PERCENT}%)
            </p>
            <p className="font-medium tabular-nums">{formatCOP(vatAmount)}</p>
          </div>
          <div
            className={cn(
              'flex items-baseline gap-3',
              align === 'end' && 'justify-end'
            )}
          >
            <p className="text-sm font-semibold">Total</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCOP(total)}
            </p>
          </div>
        </>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground">Total COP</p>
          <p className="text-lg font-semibold tabular-nums">
            {formatCOP(subtotal)}
          </p>
        </div>
      )}
    </div>
  )
}
