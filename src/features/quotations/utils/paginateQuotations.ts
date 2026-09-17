import type { Quotation } from '@/features/quotations/interfaces/quotation'

export const QUOTATION_PAGE_SIZES = [10, 20, 50] as const
export const DEFAULT_QUOTATION_PAGE_SIZE = 10

export type QuotationPageSize = (typeof QUOTATION_PAGE_SIZES)[number]

export interface QuotationPagination {
  page: number
  pageSize: QuotationPageSize
}

function readSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function isQuotationPageSize(value: number): value is QuotationPageSize {
  return (QUOTATION_PAGE_SIZES as readonly number[]).includes(value)
}

export function parseQuotationPagination(searchParams: {
  [key: string]: string | string[] | undefined
}): QuotationPagination {
  const parsedSize = Number(readSearchParam(searchParams.pageSize))
  const pageSize = isQuotationPageSize(parsedSize)
    ? parsedSize
    : DEFAULT_QUOTATION_PAGE_SIZE

  const parsedPage = Number(readSearchParam(searchParams.page))
  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1

  return { page, pageSize }
}

export function sortQuotationsByMostRecent(quotations: Quotation[]) {
  return [...quotations].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date)
    if (byDate !== 0) return byDate
    return b.createdAt.localeCompare(a.createdAt)
  })
}

export function paginateQuotations<T>(
  items: T[],
  pagination: QuotationPagination
) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize))
  const page = Math.min(pagination.page, totalPages)
  const start = (page - 1) * pagination.pageSize
  const end = start + pagination.pageSize

  return {
    items: items.slice(start, end),
    page,
    pageSize: pagination.pageSize,
    total,
    totalPages,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(end, total)
  }
}
