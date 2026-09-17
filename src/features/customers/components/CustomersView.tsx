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
import { CustomerForm } from '@/features/customers/components/CustomerForm'
import type { Customer } from '@/features/customers/interfaces/customer'

export function CustomersView({ customers }: { customers: Customer[] }) {
  return (
    <section className="space-y-4">
      <PageTitle
        title="Clientes"
        subtitle="Razón social, NIT y contacto de procura. Es lo que va en el encabezado de la cotización"
      />

      <Card>
        <CardHeader>
          <CardTitle>Crear cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razón social</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Cargo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.nit}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>{customer.contact.name}</TableCell>
                  <TableCell>{customer.contact.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
