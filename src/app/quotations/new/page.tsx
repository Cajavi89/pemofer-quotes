import { getCustomers } from '@/features/customers/services/customer.service'
import { getProducts } from '@/features/products/services/product.service'
import { NewQuotationView } from '@/features/quotations/components/NewQuotationView'

export const dynamic = 'force-dynamic'

export default async function NewQuotationPage() {
  const [customers, products] = await Promise.all([
    getCustomers(),
    getProducts()
  ])

  return <NewQuotationView customers={customers} products={products} />
}
