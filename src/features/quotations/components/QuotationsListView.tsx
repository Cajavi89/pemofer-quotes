import Link from 'next/link'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/shared/PageTitle'
import type { Customer } from '@/features/customers/interfaces/customer'
import { QuotationsListTable } from '@/features/quotations/components/QuotationsListTable'
import { QuotationsPaginationBar } from '@/features/quotations/components/QuotationsPaginationBar'
import { QuotationsSummarySidebar } from '@/features/quotations/components/QuotationsSummarySidebar'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import { QuotationsFiltersBar } from '@/features/quotations/components/QuotationsFiltersBar'
import {
  hasActiveQuotationFilters,
  type QuotationListFilters
} from '@/features/quotations/utils/filterQuotations'
import {
  paginateQuotations,
  sortQuotationsByMostRecent,
  type QuotationPagination
} from '@/features/quotations/utils/paginateQuotations'
import { routes } from '@/constants/routes'

export function QuotationsListView({
  quotations,
  filteredQuotations,
  customers,
  filters,
  pagination
}: {
  quotations: Quotation[]
  filteredQuotations: Quotation[]
  customers: Customer[]
  filters: QuotationListFilters
  pagination: QuotationPagination
}) {
  const ordered = sortQuotationsByMostRecent(filteredQuotations)
  const paged = paginateQuotations(ordered, pagination)
  const isFiltered = hasActiveQuotationFilters(filters)

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-3 flex shrink-0 flex-wrap items-end justify-between gap-2">
        <PageTitle
          title="Cotizaciones"
          subtitle="Selecciona una oferta para ver el resumen. Entra al detalle solo si lo necesitas"
        />
        <Button asChild>
          <Link href={routes.quotationsNew}>Nueva cotización</Link>
        </Button>
      </div>

      <div className="shrink-0">
        <QuotationsFiltersBar customers={customers} filters={filters} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row">
        <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <CardHeader className="shrink-0">
            <CardTitle>
              {isFiltered
                ? `${paged.total} de ${quotations.length} registradas`
                : `${quotations.length} registradas`}
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 overflow-auto">
            {quotations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no hay cotizaciones. Crea la primera para verla aquí.
              </p>
            ) : paged.total === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay cotizaciones que coincidan con la búsqueda o los filtros.
              </p>
            ) : (
              <QuotationsListTable
                quotations={paged.items}
                customers={customers}
              />
            )}
          </CardContent>
          {paged.total > 0 ? (
            <CardFooter className="w-full shrink-0 border-t pt-3">
              <QuotationsPaginationBar
                page={paged.page}
                pageSize={paged.pageSize}
                total={paged.total}
                totalPages={paged.totalPages}
                from={paged.from}
                to={paged.to}
              />
            </CardFooter>
          ) : null}
        </Card>

        <QuotationsSummarySidebar
          quotations={quotations}
          customers={customers}
        />
      </div>
    </section>
  )
}
