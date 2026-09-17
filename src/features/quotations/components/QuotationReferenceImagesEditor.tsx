'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ReferenceImagesField } from '@/features/quotations/components/ReferenceImagesField'

export function QuotationItemImagesEditor({
  quotationId,
  itemId,
  urls
}: {
  quotationId: string
  itemId: string
  urls: string[]
}) {
  const router = useRouter()
  const [currentUrls, setCurrentUrls] = useState(urls)

  async function persist(next: string[]) {
    const previous = currentUrls
    setCurrentUrls(next)
    const response = await fetch(`/api/quotations/${quotationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, referenceImageUrls: next })
    })

    if (!response.ok) {
      setCurrentUrls(previous)
      toast.error('No se pudieron guardar las imágenes')
      return
    }

    router.refresh()
  }

  return (
    <ReferenceImagesField
      id={`item-${itemId}-images`}
      urls={currentUrls}
      compact
      onChange={(next) => void persist(next)}
    />
  )
}
