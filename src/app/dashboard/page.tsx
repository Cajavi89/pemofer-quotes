import { getCustomers } from '@/features/customers/services/customer.service'
import { DashboardView } from '@/features/dashboard/components/DashboardView'
import { resolveDashboardPeriod } from '@/features/dashboard/utils/buildDashboardMetrics'
import { getQuotations } from '@/features/quotations/services/quotation.service'

export const dynamic = 'force-dynamic'

function readSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [quotations, customers, params] = await Promise.all([
    getQuotations(),
    getCustomers(),
    searchParams
  ])
  const selectedPeriod = resolveDashboardPeriod(readSearchParam(params.month))

  return (
    <DashboardView
      quotations={quotations}
      customers={customers}
      selectedPeriod={selectedPeriod}
    />
  )
}
