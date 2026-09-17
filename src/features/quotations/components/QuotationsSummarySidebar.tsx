'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Customer } from '@/features/customers/interfaces/customer'
import { QuotationsSummaryPanel } from '@/features/quotations/components/QuotationsSummaryPanel'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import {
  SELECTED_QUOTATION_PARAM,
  withQuotationsQuery
} from '@/features/quotations/utils/quotationsQuery'

export function QuotationsSummarySidebar({
  quotations,
  customers
}: {
  quotations: Quotation[]
  customers: Customer[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get(SELECTED_QUOTATION_PARAM)
  const quotation = quotations.find((item) => item.id === selectedId) ?? null
  const customer = quotation
    ? (customers.find((item) => item.id === quotation.customerId) ?? null)
    : null

  function clearSelection() {
    router.replace(
      withQuotationsQuery(searchParams, { [SELECTED_QUOTATION_PARAM]: null }),
      { scroll: false }
    )
  }

  if (!quotation) {
    return null
  }

  return (
    <aside className="flex max-h-[50vh] min-h-0 w-full shrink-0 flex-col overflow-hidden lg:h-full lg:max-h-none lg:w-80 xl:w-[22rem]">
      <QuotationsSummaryPanel
        quotation={quotation}
        customer={customer}
        onClear={clearSelection}
      />
    </aside>
  )
}
