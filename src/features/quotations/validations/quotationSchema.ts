import { z } from 'zod'
import { QUOTATION_STATUSES } from '@/features/quotations/interfaces/quotation'

export const quotationItemSchema = z.object({
  productId: z.string().optional().or(z.literal('')),
  description: z.string().min(2, 'La descripción es obligatoria'),
  quantity: z.coerce.number().positive('La cantidad debe ser mayor a 0'),
  unit: z.string().min(1, 'La unidad es obligatoria'),
  unitPrice: z.coerce
    .number()
    .nonnegative('El valor unitario no puede ser negativo'),
  deliveryTime: z.string().min(1, 'Indica el tiempo de entrega'),
  observations: z.string().optional().default('')
})

export const quotationSchema = z.object({
  clientReference: z.string().optional().default(''),
  subject: z.string().min(3, 'El asunto es obligatorio'),
  customerId: z.string().min(1, 'Selecciona un cliente'),
  contactName: z.string().min(3, 'Ingresa el contacto'),
  contactRole: z.string().min(2, 'Ingresa el cargo'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  validityDays: z.coerce.number().int().positive('La validez debe ser mayor a 0'),
  paymentTerms: z.string().min(2, 'Indica la forma de pago'),
  deliveryPlace: z.string().min(2, 'Indica el lugar de entrega'),
  pricesPlusVat: z.boolean(),
  signerName: z.string().min(3, 'Ingresa quien firma'),
  signerPhone: z.string().min(7, 'Ingresa el teléfono del firmante'),
  status: z.enum(QUOTATION_STATUSES),
  nextFollowUpAt: z.string().optional().default(''),
  items: z.array(quotationItemSchema).min(1, 'Agrega al menos un ítem'),
  referenceImageUrls: z.array(z.string().min(1)).max(4).optional().default([])
})

export type QuotationFormValues = z.infer<typeof quotationSchema>
