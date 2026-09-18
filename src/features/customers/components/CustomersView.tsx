import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ListPaginationBar } from '@/components/shared/ListPaginationBar'
import { PageTitle } from '@/components/shared/PageTitle'
import {
  CustomersCreateButton,
  CustomersCreateForm
} from '@/features/customers/components/CustomersCreatePanel'
import { CustomersFiltersBar } from '@/features/customers/components/CustomersFiltersBar'
import { CustomersListTable } from '@/features/customers/components/CustomersListTable'
import { CustomersSummarySidebar } from '@/features/customers/components/CustomersSummarySidebar'
import type { Customer } from '@/features/customers/interfaces/customer'
import {
  hasActiveCustomerFilters,
  type CustomerListFilters
} from '@/features/customers/utils/filterCustomers'
import { paginateItems, type ListPagination } from '@/lib/pagination'
import { routes } from '@/constants/routes'

export function CustomersView({
  customers,
  filteredCustomers,
  filters,
  pagination
}: {
  customers: Customer[]
  filteredCustomers: Customer[]
  filters: CustomerListFilters
  pagination: ListPagination
}) {
  const paged = paginateItems(filteredCustomers, pagination)
  const isFiltered = hasActiveCustomerFilters(filters)

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-3 shrink-0 space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <PageTitle
            title="Clientes"
            subtitle="Razón social, NIT y contacto de procura. Es lo que va en el encabezado de la cotización"
          />
          <CustomersCreateButton />
        </div>
        <CustomersCreateForm />
        <CustomersFiltersBar filters={filters} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row">
        <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <CardHeader className="shrink-0">
            <CardTitle>
              {isFiltered
                ? `${paged.total} de ${customers.length} registrados`
                : `${customers.length} registrados`}
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 overflow-auto">
            {customers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no hay clientes. Crea el primero para verlo aquí.
              </p>
            ) : paged.total === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay clientes que coincidan con la búsqueda.
              </p>
            ) : (
              <CustomersListTable customers={paged.items} />
            )}
          </CardContent>
          {paged.total > 0 ? (
            <CardFooter className="w-full shrink-0 border-t pt-3">
              <ListPaginationBar
                page={paged.page}
                pageSize={paged.pageSize}
                total={paged.total}
                totalPages={paged.totalPages}
                from={paged.from}
                to={paged.to}
                pathname={routes.customersNew}
                controlId="customer-page-size"
              />
            </CardFooter>
          ) : null}
        </Card>

        <CustomersSummarySidebar customers={customers} />
      </div>
    </section>
  )
}
