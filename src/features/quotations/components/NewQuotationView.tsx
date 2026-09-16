import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageTitle } from '@/components/shared/PageTitle'
import type { Customer } from '@/features/customers/interfaces/customer'
import type { Product } from '@/features/products/interfaces/product'
import { QuotationForm } from '@/features/quotations/components/QuotationForm'
import { COMPANY } from '@/lib/company'

export function NewQuotationView({
  customers,
  products
}: {
  customers: Customer[]
  products: Product[]
}) {
  return (
    <section>
      <PageTitle
        title="Nueva cotización"
        subtitle={`Sigue el formato de ${COMPANY.name}: señores, atención, ítems, validez y precios más IVA`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Datos de la oferta</CardTitle>
        </CardHeader>
        <CardContent>
          <QuotationForm customers={customers} products={products} />
        </CardContent>
      </Card>
    </section>
  )
}
