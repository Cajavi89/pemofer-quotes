import { Suspense } from 'react'
import { CustomersView } from '@/features/customers/components/CustomersView'
import { getCustomers } from '@/features/customers/services/customer.service'
import {
  filterCustomers,
  parseCustomerFilters,
  sortCustomersByName
} from '@/features/customers/utils/filterCustomers'
import { parseListPagination } from '@/lib/pagination'

export const dynamic = 'force-dynamic'

export default async function NewCustomerPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [customers, params] = await Promise.all([
    getCustomers(),
    searchParams
  ])
  const filters = parseCustomerFilters(params)
  const pagination = parseListPagination(params)
  const filteredCustomers = sortCustomersByName(
    filterCustomers(customers, filters)
  )

  return (
    <Suspense>
      <CustomersView
        customers={customers}
        filteredCustomers={filteredCustomers}
        filters={filters}
        pagination={pagination}
      />
    </Suspense>
  )
}
