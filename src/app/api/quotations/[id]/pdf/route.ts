import { NextResponse } from 'next/server'
import { getCustomers } from '@/features/customers/services/customer.service'
import { getQuotationById } from '@/features/quotations/services/quotation.service'
import {
  quotationPdfFileName,
  renderQuotationPdf
} from '@/features/quotations/pdf/renderQuotationPdf'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const [quotation, customers] = await Promise.all([
    getQuotationById(id),
    getCustomers()
  ])

  if (!quotation) {
    return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
  }

  const customer =
    customers.find((item) => item.id === quotation.customerId) ?? null
  const pdf = await renderQuotationPdf(quotation, customer)
  const fileName = quotationPdfFileName(quotation, customer)

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`
    }
  })
}
