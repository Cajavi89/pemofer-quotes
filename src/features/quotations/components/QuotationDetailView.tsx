import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/shared/PageTitle'
import type { Customer } from '@/features/customers/interfaces/customer'
import { QuotationStatusBadge } from '@/features/quotations/components/QuotationStatusBadge'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import {
  getLineTotal,
  getQuotationSubtotal
} from '@/features/quotations/utils/quotationTotals'
import { routes } from '@/constants/routes'
import { COMPANY } from '@/lib/company'
import { formatDate } from '@/lib/dates'
import { formatCOP } from '@/lib/money'

function DetailField({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

export function QuotationDetailView({
  quotation,
  customer
}: {
  quotation: Quotation
  customer: Customer | null
}) {
  const subtotal = getQuotationSubtotal(quotation.items)

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageTitle
          title={`Cotización ${quotation.number}`}
          subtitle={quotation.subject}
        />
        <div className="flex items-center gap-2">
          <QuotationStatusBadge status={quotation.status} />
          <Button asChild variant="outline">
            <Link href={routes.quotations}>Volver al listado</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Encabezado</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailField label="Emisor" value={`${COMPANY.name} · NIT ${COMPANY.nit}`} />
          <DetailField
            label="Señores"
            value={customer?.name ?? 'Cliente no encontrado'}
          />
          <DetailField
            label="Referencia del cliente"
            value={quotation.clientReference || '—'}
          />
          <DetailField
            label="Atención"
            value={`${quotation.contactName} · ${quotation.contactRole}`}
          />
          <DetailField label="Fecha" value={formatDate(quotation.date)} />
          <DetailField label="Lugar de entrega" value={quotation.deliveryPlace} />
          <DetailField label="Forma de pago" value={quotation.paymentTerms} />
          <DetailField
            label="Validez"
            value={`${quotation.validityDays} días`}
          />
          <DetailField
            label="Próximo seguimiento"
            value={
              quotation.nextFollowUpAt
                ? formatDate(quotation.nextFollowUpAt)
                : '—'
            }
          />
          <DetailField
            label="Firmante"
            value={`${quotation.signerName} · ${quotation.signerPhone}`}
          />
          <DetailField
            label="IVA"
            value={
              quotation.pricesPlusVat
                ? 'Precios más IVA'
                : 'Precios incluyen IVA'
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ítems</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead className="text-right">Valor unitario</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead>Observaciones</TableHead>
                <TableHead className="text-right">Valor total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotation.items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {item.description}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-right">
                    {formatCOP(item.unitPrice)}
                  </TableCell>
                  <TableCell>{item.deliveryTime}</TableCell>
                  <TableCell>{item.observations || '—'}</TableCell>
                  <TableCell className="text-right">
                    {formatCOP(getLineTotal(item.quantity, item.unitPrice))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Subtotal COP</p>
          <p className="text-2xl font-semibold">{formatCOP(subtotal)}</p>
        </div>
      </div>
    </section>
  )
}
