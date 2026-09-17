'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DEFAULT_QUOTATION_PAGE_SIZE,
  QUOTATION_PAGE_SIZES,
  type QuotationPageSize
} from '@/features/quotations/utils/paginateQuotations'
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
  const router = useRouter()
  const searchParams = useSearchParams()

  function replacePagination(next: {
    page?: number
    pageSize?: QuotationPageSize
  }) {
    const params = new URLSearchParams(searchParams.toString())
    const nextPageSize = next.pageSize ?? pageSize
    const nextPage = next.pageSize !== undefined ? 1 : (next.page ?? page)

    if (nextPageSize === DEFAULT_QUOTATION_PAGE_SIZE) {
      params.delete('pageSize')
    } else {
      params.set('pageSize', String(nextPageSize))
    }

    if (nextPage <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(nextPage))
    }

    const query = params.toString()
    router.replace(query ? `${routes.quotations}?${query}` : routes.quotations)
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="quotation-page-size" className="text-xs">
          Mostrar
        </Label>
        <Select
          value={String(pageSize)}
          onValueChange={(value) =>
            replacePagination({
              pageSize: Number(value) as QuotationPageSize
            })
          }
        >
          <SelectTrigger id="quotation-page-size" className="h-7 w-[72px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QUOTATION_PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">
        {from}-{to} de {total}
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => replacePagination({ page: page - 1 })}
          aria-label="Página anterior"
        >
          <ChevronLeft />
          Anterior
        </Button>
        <span className="min-w-16 px-2 text-center text-xs text-muted-foreground">
          {page} / {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => replacePagination({ page: page + 1 })}
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
