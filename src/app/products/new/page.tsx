import { ProductsView } from '@/features/products/components/ProductsView'
import { getProducts } from '@/features/products/services/product.service'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const products = await getProducts()
  return <ProductsView products={products} />
}
