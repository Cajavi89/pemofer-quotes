'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Customer } from '@/features/customers/interfaces/customer'
import {
  SELECTED_CUSTOMER_PARAM,
  withCustomersQuery
} from '@/features/customers/utils/customersQuery'
import { cn } from '@/lib/utils'

export function CustomersListTable({
  customers
}: {
  customers: Customer[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get(SELECTED_CUSTOMER_PARAM)

  function selectCustomer(id: string) {
    const href = withCustomersQuery(searchParams, {
      [SELECTED_CUSTOMER_PARAM]: selectedId === id ? null : id
    })
    router.replace(href, { scroll: false })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Razón social</TableHead>
          <TableHead>NIT</TableHead>
          <TableHead>Ciudad</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Cargo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => {
          const isSelected = selectedId === customer.id

          return (
            <TableRow
              key={customer.id}
              data-state={isSelected ? 'selected' : undefined}
              className={cn('cursor-pointer', isSelected && 'bg-muted/80')}
              onClick={() => selectCustomer(customer.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  selectCustomer(customer.id)
                }
              }}
              tabIndex={0}
            >
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.nit}</TableCell>
              <TableCell>{customer.city}</TableCell>
              <TableCell>{customer.contact.name}</TableCell>
              <TableCell>{customer.contact.role}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
