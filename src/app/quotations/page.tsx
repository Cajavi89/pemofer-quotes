import { Suspense } from 'react'
import { getCustomers } from '@/features/customers/services/customer.service'
import { QuotationsListView } from '@/features/quotations/components/QuotationsListView'
import { getQuotations } from '@/features/quotations/services/quotation.service'
import {
  filterQuotations,
  parseQuotationFilters
} from '@/features/quotations/utils/filterQuotations'

export const dynamic = 'force-dynamic'

export default async function QuotationsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [quotations, customers, params] = await Promise.all([
    getQuotations(),
    getCustomers(),
    searchParams
  ])
  const filters = parseQuotationFilters(params)
  const filteredQuotations = filterQuotations(quotations, customers, filters)

  return (
    <Suspense>
      <QuotationsListView
        quotations={quotations}
        filteredQuotations={filteredQuotations}
        customers={customers}
        filters={filters}
      />
    </Suspense>
  )
}
