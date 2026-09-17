import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { PageTitle } from '@/components/shared/PageTitle'
import { ProductForm } from '@/features/products/components/ProductForm'
import type { Product } from '@/features/products/interfaces/product'
import { daysSinceUpdate } from '@/features/products/services/product.service'
import { formatCOP } from '@/lib/money'

export function ProductsView({ products }: { products: Product[] }) {
  return (
    <section className="space-y-4">
      <PageTitle
        title="Productos"
        subtitle="Catálogo plano para rellenar ítems. El costo es interno; a la cotización va el precio de venta"
      />

      <Card>
        <CardHeader>
          <CardTitle>Crear producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Venta</TableHead>
                <TableHead>Actualizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const age = daysSinceUpdate(product.updatedAt)
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.description}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell className="text-right">
                      {formatCOP(product.cost)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCOP(product.salePrice)}
                    </TableCell>
                    <TableCell className={age > 15 ? 'text-amber-700' : ''}>
                      {age > 15
                        ? `Hace ${age} días · precio viejo`
                        : `Hace ${age} días`}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
