'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReferenceImagesField } from '@/features/quotations/components/ReferenceImagesField'

export function QuotationReferenceImagesEditor({
  quotationId,
  urls
}: {
  quotationId: string
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
      body: JSON.stringify({ referenceImageUrls: next })
    })

    if (!response.ok) {
      setCurrentUrls(previous)
      toast.error('No se pudieron guardar las imágenes')
      return
    }

    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imágenes de referencia</CardTitle>
      </CardHeader>
      <CardContent>
        <ReferenceImagesField urls={currentUrls} onChange={(next) => void persist(next)} />
      </CardContent>
    </Card>
  )
}
