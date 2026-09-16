import { readCollection, writeCollection } from '@/lib/jsonStore'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import type { QuotationFormValues } from '@/features/quotations/validations/quotationSchema'

const QUOTATIONS_FILE = 'quotations.json'

export async function getQuotations() {
  return readCollection<Quotation[]>(QUOTATIONS_FILE)
}

export async function createQuotation(payload: QuotationFormValues) {
  const quotations = await getQuotations()
  const year = new Date().getFullYear()
  const lastNumber = quotations
    .map((item) => Number(item.number))
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => b - a)[0]

  const created: Quotation = {
    ...payload,
    id: crypto.randomUUID(),
    number: lastNumber ? String(lastNumber + 1) : `${year}0001`,
    createdAt: new Date().toISOString(),
    items: payload.items.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
      productId: item.productId || undefined,
      observations: item.observations ?? ''
    }))
  }

  quotations.unshift(created)
  await writeCollection(QUOTATIONS_FILE, quotations)
  return created
}
