'use client'

import { useRouter } from 'next/navigation'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Customer } from '@/features/customers/interfaces/customer'
import type { Product } from '@/features/products/interfaces/product'
import { PRODUCT_UNITS } from '@/features/products/constants/productUnits'
import { QUOTATION_STATUS_LABELS } from '@/features/quotations/constants/quotationStatus'
import type { QuotationStatus } from '@/features/quotations/interfaces/quotation'
import { getQuotationSubtotal } from '@/features/quotations/utils/quotationTotals'
import { ReferenceImagesField } from '@/features/quotations/components/ReferenceImagesField'
import {
  quotationSchema,
  type QuotationFormValues
} from '@/features/quotations/validations/quotationSchema'
import { routes } from '@/constants/routes'
import { DEFAULT_SIGNER } from '@/lib/company'
import { formatCOP } from '@/lib/money'

const emptyItem = {
  productId: '',
  description: '',
  quantity: 1,
  unit: 'UNIDAD',
  unitPrice: 0,
  deliveryTime: '2 días',
  observations: ''
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

export function QuotationForm({
  customers,
  products
}: {
  customers: Customer[]
  products: Product[]
}) {
  const router = useRouter()
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      clientReference: '',
      subject: '',
      customerId: '',
      contactName: '',
      contactRole: '',
      date: getTodayIsoDate(),
      validityDays: 5,
      paymentTerms: 'Crédito 60 días',
      deliveryPlace: '',
      pricesPlusVat: true,
      signerName: DEFAULT_SIGNER.name,
      signerPhone: DEFAULT_SIGNER.phone,
      status: 'draft',
      nextFollowUpAt: '',
      items: [{ ...emptyItem }],
      referenceImageUrls: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  })

  const items = useWatch({ control: form.control, name: 'items' })
  const subtotal = getQuotationSubtotal(items ?? [])

  const applyCustomer = (customerId: string) => {
    const customer = customers.find((item) => item.id === customerId)
    if (!customer) return
    form.setValue('contactName', customer.contact.name)
    form.setValue('contactRole', customer.contact.role)
    if (!form.getValues('deliveryPlace')) {
      form.setValue('deliveryPlace', customer.city)
    }
  }

  const applyProduct = (index: number, productId: string) => {
    const product = products.find((item) => item.id === productId)
    if (!product) return
    form.setValue(`items.${index}.description`, product.description)
    form.setValue(`items.${index}.unit`, product.unit)
    form.setValue(`items.${index}.unitPrice`, product.salePrice)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch('/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })

    if (!response.ok) {
      toast.error('No se pudo guardar la cotización')
      return
    }

    const created = (await response.json()) as { id: string; number: string }
    toast.success(`Cotización ${created.number} guardada`)
    router.refresh()
    router.push(routes.quotationDetail(created.id))
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Señores</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value)
                    applyCustomer(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referencia del cliente</FormLabel>
                <FormControl>
                  <Input placeholder="O95-1267-96192641360" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Asunto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cambio de llantas traseras LVX694"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Atención</FormLabel>
                <FormControl>
                  <Input placeholder="Ing. Diana Carolina Álvarez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input placeholder="Analista Procura" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryPlace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lugar de entrega</FormLabel>
                <FormControl>
                  <Input placeholder="Cúcuta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de pago</FormLabel>
                <FormControl>
                  <Input placeholder="Crédito 60 días" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validityDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validez (días)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(
                      Object.keys(QUOTATION_STATUS_LABELS) as QuotationStatus[]
                    ).map((status) => (
                      <SelectItem key={status} value={status}>
                        {QUOTATION_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nextFollowUpAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Próximo seguimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="signerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firmante</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="signerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono firmante</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricesPlusVat"
            render={({ field }) => (
              <FormItem className="flex items-end gap-3 space-y-0 pb-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <FormLabel>Precios más IVA</FormLabel>
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Ítems</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ ...emptyItem })}
            >
              <Plus />
              Agregar ítem
            </Button>
          </div>

          <div className="space-y-2">
            {fields.map((field, index) => {
              const quantity = Number(items?.[index]?.quantity ?? 0)
              const unitPrice = Number(items?.[index]?.unitPrice ?? 0)
              return (
                <div
                  key={field.id}
                  className="grid gap-2 rounded-md border bg-card p-3 md:grid-cols-12"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field: itemField }) => (
                      <FormItem className="md:col-span-4">
                        <FormLabel>Producto del catálogo</FormLabel>
                        <Select
                          value={itemField.value || undefined}
                          onValueChange={(value) => {
                            itemField.onChange(value)
                            applyProduct(index, value)
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Opcional" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field: itemField }) => (
                      <FormItem className="md:col-span-8">
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field: itemField }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unit`}
                    render={({ field: itemField }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Unidad</FormLabel>
                        <Select
                          value={itemField.value}
                          onValueChange={itemField.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PRODUCT_UNITS.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field: itemField }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Valor unitario</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="100"
                            {...itemField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.deliveryTime`}
                    render={({ field: itemField }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Entrega</FormLabel>
                        <FormControl>
                          <Input placeholder="2 días" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end justify-between gap-2 md:col-span-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Valor total
                      </p>
                      <p className="font-medium">
                        {formatCOP(quantity * unitPrice)}
                      </p>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name={`items.${index}.observations`}
                    render={({ field: itemField }) => (
                      <FormItem className="md:col-span-12">
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Para inflado de llantas"
                            {...itemField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )
            })}
          </div>
        </section>

        <FormField
          control={form.control}
          name="referenceImageUrls"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ReferenceImagesField
                  urls={field.value ?? []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <div>
            <p className="text-sm text-muted-foreground">Subtotal COP</p>
            <p className="text-lg font-semibold">{formatCOP(subtotal)}</p>
            <p className="text-xs text-muted-foreground">
              {form.watch('pricesPlusVat')
                ? 'Precios más IVA, igual que en la plantilla Excel'
                : 'Precios incluyen IVA'}
            </p>
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Guardar cotización
          </Button>
        </div>
      </form>
    </Form>
  )
}
