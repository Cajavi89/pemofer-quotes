import { readCollection, writeCollection } from '@/lib/jsonStore'
import type { Product } from '@/features/products/interfaces/product'
import type { ProductFormValues } from '@/features/products/validations/productSchema'

const PRODUCTS_FILE = 'products.json'

export async function getProducts() {
  return readCollection<Product[]>(PRODUCTS_FILE)
}

export async function createProduct(payload: ProductFormValues) {
  const products = await getProducts()
  const created: Product = {
    ...payload,
    notes: payload.notes ?? '',
    id: crypto.randomUUID(),
    updatedAt: new Date().toISOString()
  }

  products.unshift(created)
  await writeCollection(PRODUCTS_FILE, products)
  return created
}

export function daysSinceUpdate(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
