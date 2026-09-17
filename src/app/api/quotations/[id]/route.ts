import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  getQuotationById,
  updateQuotation
} from '@/features/quotations/services/quotation.service'

export const dynamic = 'force-dynamic'

const patchSchema = z.object({
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

  const updated = await updateQuotation(id, parsed.data)
  return NextResponse.json(updated)
}
