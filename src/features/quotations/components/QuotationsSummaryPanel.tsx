'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Customer } from '@/features/customers/interfaces/customer'
import { QuotationStatusBadge } from '@/features/quotations/components/QuotationStatusBadge'
import { QuotationPdfButton } from '@/features/quotations/components/QuotationPdfButton'
import { QuotationTotals } from '@/features/quotations/components/QuotationTotals'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import { getLineTotal } from '@/features/quotations/utils/quotationTotals'
import { routes } from '@/constants/routes'
import {
  addDaysToIsoDate,
  formatDate,
  formatFollowUpLabel,
  getTodayIsoDate
} from '@/lib/dates'
import { formatCOP } from '@/lib/money'

const ITEM_PREVIEW_LIMIT = 4

function SummaryField({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

export function QuotationsSummaryPanel({
  quotation,
  customer,
  onClear
}: {
  quotation: Quotation
  customer: Customer | null
  onClear?: () => void
}) {
  const validUntil = addDaysToIsoDate(quotation.date, quotation.validityDays)
  const previewItems = quotation.items.slice(0, ITEM_PREVIEW_LIMIT)
  const extraItems = quotation.items.length - previewItems.length

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden">
      <CardHeader className="shrink-0 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle>Resumen</CardTitle>
          {onClear ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClear}
              aria-label="Cerrar resumen"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">
              Cotización {quotation.number}
            </p>
            <QuotationStatusBadge status={quotation.status} />
          </div>
          <p className="text-sm text-muted-foreground">{quotation.subject}</p>
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 space-y-4 overflow-auto">
        <div className="space-y-2">
          <SummaryField
            label="Cliente"
            value={customer?.name ?? 'Cliente'}
          />
          {customer ? (
            <p className="text-xs text-muted-foreground">
              NIT {customer.nit}
              {customer.city ? ` · ${customer.city}` : ''}
            </p>
          ) : null}
          <SummaryField
            label="Atención"
            value={`${quotation.contactName} · ${quotation.contactRole}`}
          />
          {quotation.clientReference ? (
            <SummaryField
              label="Referencia"
              value={quotation.clientReference}
            />
          ) : null}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <SummaryField label="Fecha" value={formatDate(quotation.date)} />
          <SummaryField label="Válida hasta" value={formatDate(validUntil)} />
          <SummaryField
            label="Seguimiento"
            value={formatFollowUpLabel(quotation.nextFollowUpAt, getTodayIsoDate())}
          />
          <SummaryField
            label="Entrega"
            value={quotation.deliveryPlace}
          />
        </div>
        <SummaryField label="Forma de pago" value={quotation.paymentTerms} />

        <Separator />

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Ítems ({quotation.items.length})
          </p>
          <ul className="overflow-hidden rounded-md">
            {previewItems.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 px-2 py-1.5 text-sm even:bg-muted/40"
              >
                <p className="min-w-0">
                  <span className="text-muted-foreground">
                    {item.quantity} {item.unit} ·{' '}
                  </span>
                  {item.description}
                </p>
                <span className="shrink-0 tabular-nums">
                  {formatCOP(getLineTotal(item.quantity, item.unitPrice))}
                </span>
              </li>
            ))}
          </ul>
          {extraItems > 0 ? (
            <p className="text-xs text-muted-foreground">
              y {extraItems} ítem{extraItems === 1 ? '' : 's'} más en el detalle
            </p>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="shrink-0 flex-col items-stretch gap-3 border-t pt-3">
        <QuotationTotals
          items={quotation.items}
          includeVat={quotation.pricesPlusVat}
          align="end"
        />
        <Button asChild className="w-full" variant="outline">
          <Link href={routes.quotationDetail(quotation.id)}>Ver detalle</Link>
        </Button>
        <QuotationPdfButton
          quotationId={quotation.id}
          number={quotation.number}
          className="w-full"
        />
      </CardFooter>
    </Card>
  )
}
