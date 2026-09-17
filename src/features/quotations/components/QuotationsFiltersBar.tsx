'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Customer } from '@/features/customers/interfaces/customer'
import { QUOTATION_STATUS_LABELS } from '@/features/quotations/constants/quotationStatus'
import { QUOTATION_STATUSES } from '@/features/quotations/interfaces/quotation'
import {
  ALL_FILTER_VALUE,
  hasActiveQuotationFilters,
  type QuotationListFilters
} from '@/features/quotations/utils/filterQuotations'
import { routes } from '@/constants/routes'

export function QuotationsFiltersBar({
  customers,
  filters
}: {
  customers: Customer[]
  filters: QuotationListFilters
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clientQuery, setClientQuery] = useState(filters.q)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (clientQuery.trim() === filters.q) return
      replaceFilters({ q: clientQuery.trim() })
    }, 350)

    return () => clearTimeout(timeout)
  }, [clientQuery])

  function replaceFilters(next: Partial<QuotationListFilters>) {
    const params = new URLSearchParams(searchParams.toString())
    const merged = { ...filters, ...next, q: next.q ?? clientQuery.trim() }

    for (const [key, value] of Object.entries(merged)) {
      if (!value || value === ALL_FILTER_VALUE) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }

    const query = params.toString()
    router.replace(query ? `${routes.quotations}?${query}` : routes.quotations)
  }

  function clearFilters() {
    setClientQuery('')
    router.replace(routes.quotations)
  }

  return (
    <div className="mb-3 space-y-2">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={clientQuery}
          onChange={(event) => setClientQuery(event.target.value)}
          placeholder="Buscar por cliente"
          className="pl-7"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-1">
          <Label>Estado</Label>
          <Select
            value={filters.status || ALL_FILTER_VALUE}
            onValueChange={(value) =>
              replaceFilters({
                status: value === ALL_FILTER_VALUE ? '' : value
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>Todos</SelectItem>
              {QUOTATION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {QUOTATION_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Cliente</Label>
          <Select
            value={filters.customerId || ALL_FILTER_VALUE}
            onValueChange={(value) =>
              replaceFilters({
                customerId: value === ALL_FILTER_VALUE ? '' : value
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>Todos</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Desde</Label>
          <Input
            type="date"
            value={filters.from}
            onChange={(event) => replaceFilters({ from: event.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label>Hasta</Label>
          <Input
            type="date"
            value={filters.to}
            onChange={(event) => replaceFilters({ to: event.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label>Número</Label>
          <Input
            value={filters.number}
            onChange={(event) => replaceFilters({ number: event.target.value })}
            placeholder="20260398"
          />
        </div>
      </div>

      {hasActiveQuotationFilters(filters) && (
        <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
