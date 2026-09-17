import Link from 'next/link'
import {
  CheckCircle2,
  CircleX,
  ClipboardList,
  Clock
} from 'lucide-react'
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
import { DashboardKpiCard } from '@/features/dashboard/components/DashboardKpiCard'
import { DashboardMonthSelect } from '@/features/dashboard/components/DashboardMonthSelect'
import { DashboardStatusChart } from '@/features/dashboard/components/DashboardStatusChart'
import { DashboardValueChart } from '@/features/dashboard/components/DashboardValueChart'
import {
  buildDashboardKpis,
  buildStatusSlices,
  buildValueSeries,
  formatMonthLabel,
  formatPeriodRange,
  getMonthPeriod,
  getPreviousMonth,
  getRecentQuotations,
  isInMonth,
  type MonthPeriod
} from '@/features/dashboard/utils/buildDashboardMetrics'
import { QuotationStatusBadge } from '@/features/quotations/components/QuotationStatusBadge'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import { getQuotationSubtotal } from '@/features/quotations/utils/quotationTotals'
import { routes } from '@/constants/routes'
import { formatDate, formatFollowUpLabel, getTodayIsoDate } from '@/lib/dates'
import { formatCOP } from '@/lib/money'

const kpiIcons = {
  total: ClipboardList,
  followUp: Clock,
  awarded: CheckCircle2,
  lost: CircleX
} as const

export function DashboardView({
  quotations,
  customers,
  selectedPeriod
}: {
  quotations: Quotation[]
  customers: Customer[]
  selectedPeriod: MonthPeriod
}) {
  const today = getTodayIsoDate()
  const currentPeriod = getMonthPeriod(new Date())
  const previousPeriod = getPreviousMonth(selectedPeriod)
  const selectedQuotations = quotations.filter((item) =>
    isInMonth(item.date, selectedPeriod)
  )
  const previousQuotations = quotations.filter((item) =>
    isInMonth(item.date, previousPeriod)
  )
  const kpis = buildDashboardKpis(selectedQuotations, previousQuotations)
  const recent = getRecentQuotations(selectedQuotations)
  const customersById = new Map(customers.map((item) => [item.id, item]))
  const statusSlices = buildStatusSlices(selectedQuotations)
  const valueSeries = buildValueSeries(selectedQuotations, selectedPeriod)
  const awardedValueSeries = buildValueSeries(
    selectedQuotations.filter((item) => item.status === 'awarded'),
    selectedPeriod
  )

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <PageTitle
          title="Dashboard"
          subtitle={`Resumen de ${formatMonthLabel(selectedPeriod)} comparado con el mes anterior`}
        />
        <div className="flex flex-wrap items-end gap-2">
          <DashboardMonthSelect
            selectedPeriod={selectedPeriod}
            currentPeriod={currentPeriod}
          />
          <p className="rounded-md border bg-card px-2.5 py-1 text-xs text-muted-foreground">
            {formatPeriodRange(selectedPeriod)}
          </p>
        </div>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <DashboardKpiCard key={kpi.key} kpi={kpi} icon={kpiIcons[kpi.key]} />
        ))}
      </div>

      <div className="mb-3 grid gap-3 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Estado de cotizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStatusChart slices={statusSlices} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valor de cotizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardValueChart points={valueSeries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valor de adjudicadas</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardValueChart
              points={awardedValueSeries}
              stroke="#059669"
              emptyLabel="No hay cotizaciones adjudicadas en el período."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Cotizaciones recientes</CardTitle>
          <Button asChild variant="link" className="h-auto px-0 text-xs">
            <Link href={routes.quotations}>Ver todas las cotizaciones</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay cotizaciones en este mes.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último seguimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={routes.quotationDetail(quotation.id)}
                        className="underline-offset-4 hover:underline"
                      >
                        {quotation.number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {customersById.get(quotation.customerId)?.name ??
                        'Cliente'}
                    </TableCell>
                    <TableCell>{formatDate(quotation.date)}</TableCell>
                    <TableCell className="text-right">
                      {formatCOP(getQuotationSubtotal(quotation.items))}
                    </TableCell>
                    <TableCell>
                      <QuotationStatusBadge status={quotation.status} />
                    </TableCell>
                    <TableCell>
                      {formatFollowUpLabel(quotation.nextFollowUpAt, today)}
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
