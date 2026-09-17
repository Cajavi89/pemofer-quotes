import type { Customer } from '@/features/customers/interfaces/customer'
import {
  QUOTATION_STATUSES,
  type Quotation,
  type QuotationStatus
} from '@/features/quotations/interfaces/quotation'

export const ALL_FILTER_VALUE = 'all'

export interface QuotationListFilters {
  q: string
  status: string
  customerId: string
  number: string
  from: string
  to: string
}

export const emptyQuotationFilters: QuotationListFilters = {
  q: '',
  status: '',
  customerId: '',
  number: '',
  from: '',
  to: ''
}

function readSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export function parseQuotationFilters(searchParams: {
  [key: string]: string | string[] | undefined
}): QuotationListFilters {
  const status = readSearchParam(searchParams.status)

  return {
    q: readSearchParam(searchParams.q).trim(),
    status: QUOTATION_STATUSES.includes(status as QuotationStatus) ? status : '',
    customerId: readSearchParam(searchParams.customerId),
    number: readSearchParam(searchParams.number).trim(),
    from: readSearchParam(searchParams.from),
    to: readSearchParam(searchParams.to)
  }
}

export function hasActiveQuotationFilters(filters: QuotationListFilters) {
  return Object.values(filters).some((value) => value.length > 0)
}

export function filterQuotations(
  quotations: Quotation[],
  customers: Customer[],
  filters: QuotationListFilters
) {
  const customersById = new Map(customers.map((item) => [item.id, item]))

  return quotations.filter((quotation) => {
    const customer = customersById.get(quotation.customerId)
    const haystack = [
      customer?.name,
      customer?.nit,
      customer?.contact.name,
      quotation.contactName
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    if (filters.q && !haystack.includes(filters.q.toLowerCase())) {
      return false
    }

    if (filters.status && quotation.status !== filters.status) {
      return false
    }

    if (filters.customerId && quotation.customerId !== filters.customerId) {
      return false
    }

    if (filters.number && !quotation.number.includes(filters.number)) {
      return false
    }

    if (filters.from && quotation.date < filters.from) {
      return false
    }

    if (filters.to && quotation.date > filters.to) {
      return false
    }

    return true
  })
}
