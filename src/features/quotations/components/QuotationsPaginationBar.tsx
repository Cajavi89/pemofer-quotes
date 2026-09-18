'use client'

import { ListPaginationBar } from '@/components/shared/ListPaginationBar'
import type { QuotationPageSize } from '@/features/quotations/utils/paginateQuotations'
import { routes } from '@/constants/routes'

export function QuotationsPaginationBar({
  page,
  pageSize,
  total,
  totalPages,
  from,
  to
}: {
  page: number
  pageSize: QuotationPageSize
  total: number
  totalPages: number
  from: number
  to: number
}) {
  return (
    <ListPaginationBar
      page={page}
      pageSize={pageSize}
      total={total}
      totalPages={totalPages}
      from={from}
      to={to}
      pathname={routes.quotations}
      controlId="quotation-page-size"
    />
  )
}
