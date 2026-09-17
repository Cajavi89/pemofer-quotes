'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Customer } from '@/features/customers/interfaces/customer'
import { QuotationStatusBadge } from '@/features/quotations/components/QuotationStatusBadge'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import { getQuotationAmounts } from '@/features/quotations/utils/quotationTotals'
import {
  SELECTED_QUOTATION_PARAM,
  withQuotationsQuery
} from '@/features/quotations/utils/quotationsQuery'
import { formatDate } from '@/lib/dates'
import { formatCOP } from '@/lib/money'
import { cn } from '@/lib/utils'

export function QuotationsListTable({
  quotations,
  customers
}: {
  quotations: Quotation[]
  customers: Customer[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get(SELECTED_QUOTATION_PARAM)
  const customersById = new Map(customers.map((item) => [item.id, item]))

  function selectQuotation(id: string) {
    const href = withQuotationsQuery(searchParams, {
      [SELECTED_QUOTATION_PARAM]: selectedId === id ? null : id
    })
    router.replace(href, { scroll: false })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Asunto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotations.map((quotation) => {
          const isSelected = selectedId === quotation.id

          return (
            <TableRow
              key={quotation.id}
              data-state={isSelected ? 'selected' : undefined}
              className={cn(
                'cursor-pointer',
                isSelected && 'bg-muted/80'
              )}
              onClick={() => selectQuotation(quotation.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  selectQuotation(quotation.id)
                }
              }}
              tabIndex={0}
            >
              <TableCell className="font-medium">{quotation.number}</TableCell>
              <TableCell>{formatDate(quotation.date)}</TableCell>
              <TableCell>
                {customersById.get(quotation.customerId)?.name ?? 'Cliente'}
              </TableCell>
              <TableCell>{quotation.subject}</TableCell>
              <TableCell>
                <QuotationStatusBadge status={quotation.status} />
              </TableCell>
              <TableCell className="text-right">
                {formatCOP(
                  getQuotationAmounts(
                    quotation.items,
                    quotation.pricesPlusVat
                  ).total
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
