'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  hasActiveCustomerFilters,
  type CustomerListFilters
} from '@/features/customers/utils/filterCustomers'
import { customersListHref } from '@/features/customers/utils/customersQuery'

export function CustomersFiltersBar({
  filters
}: {
  filters: CustomerListFilters
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(filters.q)

  useEffect(() => {
    setQuery(filters.q)
  }, [filters.q])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() === filters.q) return
      replaceQuery(query.trim())
    }, 350)

    return () => clearTimeout(timeout)
  }, [query])

  function replaceQuery(nextQuery: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextQuery) {
      params.set('q', nextQuery)
    } else {
      params.delete('q')
    }
    params.delete('page')
    router.replace(customersListHref(params))
  }

  function clearFilters() {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')
    router.replace(customersListHref(params))
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre o NIT"
          className="pl-7"
        />
      </div>
      {hasActiveCustomerFilters(filters) ? (
        <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
          Limpiar
        </Button>
      ) : null}
    </div>
  )
}
