'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MAX_REFERENCE_IMAGES = 4

export function ReferenceImagesField({
  urls,
  onChange
}: {
  urls: string[]
  onChange: (urls: string[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    if (urls.length >= MAX_REFERENCE_IMAGES) {
      toast.error(`Puedes adjuntar hasta ${MAX_REFERENCE_IMAGES} imágenes`)
      return
    }

    setUploading(true)
    try {
      const remaining = MAX_REFERENCE_IMAGES - urls.length
      const next = [...urls]

      for (const file of Array.from(fileList).slice(0, remaining)) {
        const body = new FormData()
        body.append('file', file)
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body
        })
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error ?? 'No se pudo subir la imagen')
        }
        next.push(payload.url)
      }

      onChange(next)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'No se pudo subir la imagen'
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Label htmlFor="reference-images">Imágenes de referencia</Label>
          <p className="text-xs text-muted-foreground">
            Opcional. Se incluyen en el PDF, como en la cotización de Excel.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || urls.length >= MAX_REFERENCE_IMAGES}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus />
          {uploading ? 'Subiendo…' : 'Agregar imagen'}
        </Button>
        <Input
          ref={inputRef}
          id="reference-images"
          type="file"
          accept="image/png,image/jpeg"
          multiple
          className="hidden"
          onChange={(event) => {
            void uploadFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {urls.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {urls.map((url) => (
            <div
              key={url}
              className="relative overflow-hidden rounded-md border bg-muted/30"
            >
              <img
                src={url}
                alt="Imagen de referencia"
                className="h-28 w-full object-contain p-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 bg-background/90"
                onClick={() => onChange(urls.filter((item) => item !== url))}
                aria-label="Quitar imagen"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
