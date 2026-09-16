import { CustomersView } from '@/features/customers/components/CustomersView'
import { getCustomers } from '@/features/customers/services/customer.service'

export const dynamic = 'force-dynamic'

export default async function NewCustomerPage() {
  const customers = await getCustomers()
  return <CustomersView customers={customers} />
}
