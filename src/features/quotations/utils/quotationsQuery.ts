import { routes } from '@/constants/routes'

export const SELECTED_QUOTATION_PARAM = 'selected'

export function quotationsListHref(searchParams: URLSearchParams) {
  const query = searchParams.toString()
  return query ? `${routes.quotations}?${query}` : routes.quotations
}

export function withQuotationsQuery(
  searchParams: URLSearchParams,
  updates: Record<string, string | null>
) {
  const params = new URLSearchParams(searchParams.toString())

  for (const [key, value] of Object.entries(updates)) {
    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  }

  return quotationsListHref(params)
}
