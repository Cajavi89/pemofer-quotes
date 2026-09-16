import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(3, 'La razón social debe tener al menos 3 caracteres'),
  nit: z.string().min(5, 'Ingresa el NIT'),
  city: z.string().min(2, 'Ingresa la ciudad'),
  contact: z.object({
    name: z.string().min(3, 'Ingresa el nombre del contacto'),
    role: z.string().min(2, 'Ingresa el cargo'),
    phone: z.string().min(7, 'Ingresa el teléfono'),
    email: z.string().email('Correo inválido').or(z.literal(''))
  })
})

export type CustomerFormValues = z.infer<typeof customerSchema>
