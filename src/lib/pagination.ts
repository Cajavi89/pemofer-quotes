export const PAGE_SIZES = [10, 20, 50] as const
export const DEFAULT_PAGE_SIZE = 10

export type PageSize = (typeof PAGE_SIZES)[number]

export interface ListPagination {
  page: number
  pageSize: PageSize
}

function readSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function isPageSize(value: number): value is PageSize {
  return (PAGE_SIZES as readonly number[]).includes(value)
}

export function parseListPagination(searchParams: {
  [key: string]: string | string[] | undefined
}): ListPagination {
  const parsedSize = Number(readSearchParam(searchParams.pageSize))
  const pageSize = isPageSize(parsedSize) ? parsedSize : DEFAULT_PAGE_SIZE

  const parsedPage = Number(readSearchParam(searchParams.page))
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1

  return { page, pageSize }
}

export function paginateItems<T>(items: T[], pagination: ListPagination) {
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
