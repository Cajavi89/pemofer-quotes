import { readCollection, writeCollection } from '@/lib/jsonStore'
import type { Customer } from '@/features/customers/interfaces/customer'
import type { CustomerFormValues } from '@/features/customers/validations/customerSchema'

const CUSTOMERS_FILE = 'customers.json'

export async function getCustomers() {
  return readCollection<Customer[]>(CUSTOMERS_FILE)
}

export async function createCustomer(payload: CustomerFormValues) {
  const customers = await getCustomers()
  const created: Customer = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  }

  customers.unshift(created)
  await writeCollection(CUSTOMERS_FILE, customers)
  return created
}
