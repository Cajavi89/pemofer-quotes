import type { Customer } from '@/features/customers/interfaces/customer'

export interface CustomerListFilters {
  q: string
}

function readSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export function parseCustomerFilters(searchParams: {
  [key: string]: string | string[] | undefined
}): CustomerListFilters {
  return {
    q: readSearchParam(searchParams.q).trim()
  }
}

export function hasActiveCustomerFilters(filters: CustomerListFilters) {
  return filters.q.length > 0
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function normalizeNit(value: string) {
  return value.replace(/[.\-\s]/g, '').toLowerCase()
}

export function filterCustomers(
  customers: Customer[],
  filters: CustomerListFilters
) {
  const query = filters.q.trim()
  if (!query) return customers

  const text = normalizeText(query)
  const nit = normalizeNit(query)

  return customers.filter((customer) => {
    const nameMatch = normalizeText(customer.name).includes(text)
    const contactMatch = normalizeText(customer.contact.name).includes(text)
    const nitMatch = normalizeNit(customer.nit).includes(nit)
    return nameMatch || contactMatch || nitMatch
  })
}

export function sortCustomersByName(customers: Customer[]) {
  return [...customers].sort((a, b) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
  )
}
