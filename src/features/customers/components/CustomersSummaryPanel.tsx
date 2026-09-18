'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Customer } from '@/features/customers/interfaces/customer'
import { formatDate } from '@/lib/dates'

function SummaryField({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || '—'}</p>
    </div>
  )
}

export function CustomersSummaryPanel({
  customer,
  onClear
}: {
  customer: Customer
  onClear?: () => void
}) {
  const createdAt = formatDate(customer.createdAt.slice(0, 10))

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden">
      <CardHeader className="shrink-0 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle>Resumen</CardTitle>
          {onClear ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClear}
              aria-label="Cerrar resumen"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">{customer.name}</p>
          <p className="text-sm text-muted-foreground">NIT {customer.nit}</p>
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 space-y-4 overflow-auto">
        <div className="space-y-3">
          <SummaryField label="Ciudad" value={customer.city} />
          <SummaryField label="Registrado" value={createdAt} />
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Contacto
          </p>
          <SummaryField label="Nombre" value={customer.contact.name} />
          <SummaryField label="Cargo" value={customer.contact.role} />
          <div>
            <p className="text-xs text-muted-foreground">Teléfono</p>
            {customer.contact.phone ? (
              <a
                href={`tel:${customer.contact.phone}`}
                className="text-sm font-medium hover:underline"
              >
                {customer.contact.phone}
              </a>
            ) : (
              <p className="text-sm font-medium">—</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Correo</p>
            {customer.contact.email ? (
              <a
                href={`mailto:${customer.contact.email}`}
                className="text-sm font-medium hover:underline"
              >
                {customer.contact.email}
              </a>
            ) : (
              <p className="text-sm font-medium">—</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
