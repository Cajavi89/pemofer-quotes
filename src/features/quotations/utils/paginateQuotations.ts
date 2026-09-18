import type { Quotation } from '@/features/quotations/interfaces/quotation'

export {
  PAGE_SIZES as QUOTATION_PAGE_SIZES,
  DEFAULT_PAGE_SIZE as DEFAULT_QUOTATION_PAGE_SIZE,
  parseListPagination as parseQuotationPagination,
  paginateItems as paginateQuotations
} from '@/lib/pagination'
export type {
  PageSize as QuotationPageSize,
  ListPagination as QuotationPagination
} from '@/lib/pagination'

export function sortQuotationsByMostRecent(quotations: Quotation[]) {
  return [...quotations].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date)
    if (byDate !== 0) return byDate
    return b.createdAt.localeCompare(a.createdAt)
  })
}
