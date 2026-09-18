import { routes } from '@/constants/routes'

export const SELECTED_CUSTOMER_PARAM = 'selected'
export const CREATE_CUSTOMER_PARAM = 'create'

export function customersListHref(searchParams: URLSearchParams) {
  const query = searchParams.toString()
  return query ? `${routes.customersNew}?${query}` : routes.customersNew
}

export function withCustomersQuery(
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

  return customersListHref(params)
}
