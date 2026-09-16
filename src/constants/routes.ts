export const routes = {
  dashboard: '/dashboard',
  quotations: '/quotations',
  quotationsNew: '/quotations/new',
  quotationDetail: (id: string) => `/quotations/${id}`,
  customersNew: '/customers/new',
  productsNew: '/products/new'
} as const
