'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomerForm } from '@/features/customers/components/CustomerForm'
import {
  CREATE_CUSTOMER_PARAM,
  withCustomersQuery
} from '@/features/customers/utils/customersQuery'

function useCreateCustomerForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOpen = searchParams.get(CREATE_CUSTOMER_PARAM) === '1'

  function setOpen(open: boolean) {
    router.replace(
      withCustomersQuery(searchParams, {
        [CREATE_CUSTOMER_PARAM]: open ? '1' : null
      }),
      { scroll: false }
    )
  }

  return { isOpen, setOpen }
}

export function CustomersCreateButton() {
  const { isOpen, setOpen } = useCreateCustomerForm()

  if (isOpen) return null

  return (
    <Button type="button" onClick={() => setOpen(true)}>
      <Plus />
      Nuevo cliente
    </Button>
  )
}

export function CustomersCreateForm() {
  const { isOpen, setOpen } = useCreateCustomerForm()

  if (!isOpen) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Crear cliente</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setOpen(false)}
          aria-label="Cerrar formulario"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <CustomerForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </CardContent>
    </Card>
  )
}
