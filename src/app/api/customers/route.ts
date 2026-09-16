import { NextResponse } from 'next/server'
import {
  createCustomer,
  getCustomers
} from '@/features/customers/services/customer.service'
import { customerSchema } from '@/features/customers/validations/customerSchema'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(await getCustomers())
}

export async function POST(request: Request) {
  const parsed = customerSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const created = await createCustomer(parsed.data)
  return NextResponse.json(created, { status: 201 })
}
