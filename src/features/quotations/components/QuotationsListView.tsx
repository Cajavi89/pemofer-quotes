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
import { QuotationsFiltersBar } from '@/features/quotations/components/QuotationsFiltersBar'
import { getQuotationSubtotal } from '@/features/quotations/utils/quotationTotals'
import {
  hasActiveQuotationFilters,
  type QuotationListFilters
} from '@/features/quotations/utils/filterQuotations'
import { routes } from '@/constants/routes'
import { formatDate } from '@/lib/dates'
import { formatCOP } from '@/lib/money'

export function QuotationsListView({
  quotations,
  filteredQuotations,
  customers,
  filters
}: {
  quotations: Quotation[]
  filteredQuotations: Quotation[]
  customers: Customer[]
  filters: QuotationListFilters
}) {
  const customersById = new Map(customers.map((item) => [item.id, item]))
  const ordered = [...filteredQuotations].sort((a, b) =>
    b.date.localeCompare(a.date)
  )
  const isFiltered = hasActiveQuotationFilters(filters)

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <PageTitle
          title="Cotizaciones"
          subtitle="Listado de ofertas. Entra a cualquiera para ver el detalle completo"
        />
        <Button asChild>
          <Link href={routes.quotationsNew}>Nueva cotización</Link>
        </Button>
      </div>

      <QuotationsFiltersBar customers={customers} filters={filters} />

      <Card>
        <CardHeader>
          <CardTitle>
            {isFiltered
              ? `${ordered.length} de ${quotations.length} registradas`
              : `${quotations.length} registradas`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quotations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay cotizaciones. Crea la primera para verla aquí.
            </p>
          ) : ordered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay cotizaciones que coincidan con la búsqueda o los filtros.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordered.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={routes.quotationDetail(quotation.id)}
                        className="underline-offset-4 hover:underline"
                      >
                        {quotation.number}
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(quotation.date)}</TableCell>
                    <TableCell>
                      {customersById.get(quotation.customerId)?.name ??
                        'Cliente'}
                    </TableCell>
                    <TableCell>{quotation.subject}</TableCell>
                    <TableCell>
                      <QuotationStatusBadge status={quotation.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCOP(getQuotationSubtotal(quotation.items))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={routes.quotationDetail(quotation.id)}>
                          Ver detalle
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
