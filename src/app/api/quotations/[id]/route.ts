import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  getQuotationById,
  updateQuotationItemImages
} from '@/features/quotations/services/quotation.service'

export const dynamic = 'force-dynamic'

const patchSchema = z.object({
  itemId: z.string().min(1),
  referenceImageUrls: z.array(z.string().min(1)).max(4)
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const quotation = await getQuotationById(id)
  if (!quotation) {
    return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
  }

  const parsed = patchSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const updated = await updateQuotationItemImages(
    id,
    parsed.data.itemId,
    parsed.data.referenceImageUrls
  )
  if (!updated) {
    return NextResponse.json({ error: 'Ítem no encontrado' }, { status: 404 })
  }
  return NextResponse.json(updated)
}
