'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function QuotationPdfButton({
  quotationId,
  number,
  variant = 'default',
  className
}: {
  quotationId: string
  number: string
  variant?: 'default' | 'outline'
  className?: string
}) {
  const [loading, setLoading] = useState(false)

  async function downloadPdf() {
    setLoading(true)
    try {
      const response = await fetch(`/api/quotations/${quotationId}/pdf`)
      if (!response.ok) {
        throw new Error('No se pudo generar el PDF')
      }

      const blob = await response.blob()
      const header = response.headers.get('content-disposition')
      const fileName =
        header?.match(/filename="([^"]+)"/)?.[1] ??
        `COT-${number}.pdf`
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'No se pudo generar el PDF'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={loading}
      onClick={() => void downloadPdf()}
    >
      <FileDown />
      {loading ? 'Generando…' : 'Generar PDF'}
    </Button>
  )
}
