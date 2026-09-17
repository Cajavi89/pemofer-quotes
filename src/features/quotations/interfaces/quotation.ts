export const QUOTATION_STATUSES = [
  'draft',
  'sent',
  'follow_up',
  'awarded',
  'lost',
  'expired'
] as const

export type QuotationStatus = (typeof QUOTATION_STATUSES)[number]

export interface QuotationItem {
  id: string
  productId?: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  deliveryTime: string
  observations: string
  referenceImageUrls?: string[]
}

export interface Quotation {
  id: string
  number: string
  clientReference: string
  subject: string
  customerId: string
  contactName: string
  contactRole: string
  date: string
  validityDays: number
  paymentTerms: string
  deliveryPlace: string
  pricesPlusVat: boolean
  signerName: string
  signerPhone: string
  status: QuotationStatus
  items: QuotationItem[]
  nextFollowUpAt?: string
  createdAt: string
}
