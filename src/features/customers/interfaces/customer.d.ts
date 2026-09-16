export interface CustomerContact {
  name: string
  role: string
  phone: string
  email: string
}

export interface Customer {
  id: string
  name: string
  nit: string
  city: string
  contact: CustomerContact
  createdAt: string
}
