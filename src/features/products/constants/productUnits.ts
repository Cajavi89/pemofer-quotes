export const PRODUCT_UNITS = [
  'UNIDAD',
  'METRO',
  'KILO',
  'GALON',
  'CAJA',
  'JUEGO'
] as const

export type ProductUnit = (typeof PRODUCT_UNITS)[number]
