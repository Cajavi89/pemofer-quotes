'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Customer } from '@/features/customers/interfaces/customer'
import { CustomersSummaryPanel } from '@/features/customers/components/CustomersSummaryPanel'
import {
  SELECTED_CUSTOMER_PARAM,
  withCustomersQuery
} from '@/features/customers/utils/customersQuery'

export function CustomersSummarySidebar({
  customers
}: {
  customers: Customer[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get(SELECTED_CUSTOMER_PARAM)
  const customer = customers.find((item) => item.id === selectedId) ?? null

  function clearSelection() {
    router.replace(
      withCustomersQuery(searchParams, { [SELECTED_CUSTOMER_PARAM]: null }),
      { scroll: false }
    )
  }

  if (!customer) {
    return null
  }

  return (
    <aside className="flex max-h-[50vh] min-h-0 w-full shrink-0 flex-col overflow-hidden lg:h-full lg:max-h-none lg:w-80 xl:w-[22rem]">
      <CustomersSummaryPanel customer={customer} onClear={clearSelection} />
    </aside>
  )
}
