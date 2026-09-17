export const VAT_RATE = 0.19
export const VAT_PERCENT = Math.round(VAT_RATE * 100)

export function getLineTotal(quantity: number, unitPrice: number) {
  return quantity * unitPrice
}

export function getQuotationSubtotal(
  items: Array<{ quantity: number; unitPrice: number }>
) {
  return items.reduce(
    (sum, item) => sum + getLineTotal(item.quantity, item.unitPrice),
    0
  )
}

export function getQuotationVat(subtotal: number) {
  return Math.round(subtotal * VAT_RATE)
}

export function getQuotationTotal(subtotal: number, includeVat: boolean) {
  return includeVat ? subtotal + getQuotationVat(subtotal) : subtotal
}

export function getQuotationAmounts(
  items: Array<{ quantity: number; unitPrice: number }>,
  includeVat: boolean
) {
  const subtotal = getQuotationSubtotal(items)
  const vatAmount = includeVat ? getQuotationVat(subtotal) : 0
  const total = includeVat ? subtotal + vatAmount : subtotal
  return { subtotal, vatAmount, total }
}
