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
import { buildDashboardMetrics } from '@/features/dashboard/utils/buildDashboardMetrics'
import { QuotationStatusBadge } from '@/features/quotations/components/QuotationStatusBadge'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import { getQuotationSubtotal } from '@/features/quotations/utils/quotationTotals'
import { routes } from '@/constants/routes'
import { formatCOP } from '@/lib/money'

export function DashboardView({
  quotations,
  customers
}: {
  quotations: Quotation[]
  customers: Customer[]
}) {
  const customersById = new Map(customers.map((item) => [item.id, item]))
  const metrics = buildDashboardMetrics(quotations)
  const recent = [...quotations].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <PageTitle
          title="Dashboard"
          subtitle="Estado comercial del piloto, con la data quemada de Pemofer"
        />
        <Button asChild>
          <Link href={routes.quotationsNew}>Nueva cotización</Link>
        </Button>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cotizaciones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">
                    {quotation.number}
                  </TableCell>
                  <TableCell>
                    {customersById.get(quotation.customerId)?.name ?? 'Cliente'}
                  </TableCell>
                  <TableCell>{quotation.subject}</TableCell>
                  <TableCell>
                    <QuotationStatusBadge status={quotation.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCOP(getQuotationSubtotal(quotation.items))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
