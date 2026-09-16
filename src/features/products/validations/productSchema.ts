import { z } from 'zod'

export const productSchema = z.object({
  description: z.string().min(3, 'La descripción es obligatoria'),
  unit: z.string().min(1, 'Selecciona la unidad'),
  brand: z.string().min(1, 'Ingresa la marca'),
  category: z.string().min(1, 'Ingresa la categoría'),
  cost: z.coerce.number().nonnegative('El costo no puede ser negativo'),
  salePrice: z.coerce.number().positive('El precio de venta debe ser mayor a 0'),
  supplier: z.string().min(2, 'Ingresa el proveedor'),
  notes: z.string().optional().default('')
})

export type ProductFormValues = z.infer<typeof productSchema>
