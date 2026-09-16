import { NextResponse } from 'next/server'
import {
  createQuotation,
  getQuotations
} from '@/features/quotations/services/quotation.service'
import { quotationSchema } from '@/features/quotations/validations/quotationSchema'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(await getQuotations())
}

export async function POST(request: Request) {
  const parsed = quotationSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const created = await createQuotation(parsed.data)
  return NextResponse.json(created, { status: 201 })
}
