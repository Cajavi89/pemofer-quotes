import { NextResponse } from 'next/server'
import {
  createProduct,
  getProducts
} from '@/features/products/services/product.service'
import { productSchema } from '@/features/products/validations/productSchema'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(await getProducts())
}

export async function POST(request: Request) {
  const parsed = productSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const created = await createProduct(parsed.data)
  return NextResponse.json(created, { status: 201 })
}
