import { getCustomers } from '@/features/customers/services/customer.service'
import { DashboardView } from '@/features/dashboard/components/DashboardView'
import { getQuotations } from '@/features/quotations/services/quotation.service'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [quotations, customers] = await Promise.all([
    getQuotations(),
    getCustomers()
  ])

  return <DashboardView quotations={quotations} customers={customers} />
}
