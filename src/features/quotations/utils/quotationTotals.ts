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
