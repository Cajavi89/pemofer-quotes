import { notFound } from 'next/navigation'
import { getCustomers } from '@/features/customers/services/customer.service'
import { QuotationDetailView } from '@/features/quotations/components/QuotationDetailView'
import { getQuotationById } from '@/features/quotations/services/quotation.service'

export const dynamic = 'force-dynamic'

export default async function QuotationDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [quotation, customers] = await Promise.all([
    getQuotationById(id),
    getCustomers()
  ])

  if (!quotation) {
    notFound()
  }

  const customer =
    customers.find((item) => item.id === quotation.customerId) ?? null

  return <QuotationDetailView quotation={quotation} customer={customer} />
}
