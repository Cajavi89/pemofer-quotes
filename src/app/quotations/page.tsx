import { getCustomers } from '@/features/customers/services/customer.service'
import { QuotationsListView } from '@/features/quotations/components/QuotationsListView'
import { getQuotations } from '@/features/quotations/services/quotation.service'

export const dynamic = 'force-dynamic'

export default async function QuotationsPage() {
  const [quotations, customers] = await Promise.all([
    getQuotations(),
    getCustomers()
  ])

  return <QuotationsListView quotations={quotations} customers={customers} />
}
