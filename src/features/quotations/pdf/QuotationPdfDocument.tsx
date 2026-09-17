import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View
} from '@react-pdf/renderer'
import type { Customer } from '@/features/customers/interfaces/customer'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import {
  getLineTotal,
  getQuotationSubtotal
} from '@/features/quotations/utils/quotationTotals'
import { COMPANY } from '@/lib/company'
import { formatLetterDate } from '@/lib/dates'
import { formatCOP } from '@/lib/money'

const navy = '#1B365D'
const gold = '#C5A35A'
const muted = '#4B5563'
const stripe = '#F4F1EA'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: navy,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 32
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: gold
  },
  logo: {
    width: 150,
    height: 62,
    objectFit: 'contain'
  },
  headerMeta: {
    alignItems: 'flex-end'
  },
  companyLine: {
    fontSize: 8,
    color: muted,
    marginBottom: 2
  },
  quotationNumber: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: navy
  },
  dateLine: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10
  },
  party: {
    marginBottom: 4,
    fontSize: 9
  },
  partyLabel: {
    fontFamily: 'Helvetica-Bold'
  },
  title: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase'
  },
  body: {
    flexDirection: 'row',
    gap: 10
  },
  tableWrap: {
    flex: 1
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: navy,
    color: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 3
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D6D3CD'
  },
  striped: {
    backgroundColor: stripe
  },
  colItem: { width: '5%', paddingRight: 3 },
  colDesc: { width: '24%', paddingRight: 3 },
  colQty: { width: '9%', paddingRight: 3 },
  colUnit: { width: '10%', paddingRight: 3 },
  colMoney: { width: '13%', paddingRight: 3 },
  colDelivery: { width: '12%', paddingRight: 3 },
  colNotes: { width: '14%' },
  headerCell: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7
  },
  cell: {
    fontSize: 7.5
  },
  right: {
    textAlign: 'right'
  },
  imagesColumn: {
    width: 150
  },
  imageCard: {
    marginBottom: 8,
    padding: 4,
    borderWidth: 0.6,
    borderColor: gold
  },
  referenceImage: {
    width: 142,
    height: 90,
    objectFit: 'contain'
  },
  imageCaption: {
    marginTop: 3,
    fontSize: 6.5,
    color: muted,
    textAlign: 'center'
  },
  totals: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  totalsBox: {
    minWidth: 180,
    alignItems: 'flex-end'
  },
  totalLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold'
  },
  totalValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2
  },
  conditions: {
    marginTop: 12,
    gap: 3
  },
  condition: {
    fontSize: 8
  },
  signature: {
    marginTop: 28
  },
  signatureLabel: {
    fontSize: 8,
    marginBottom: 16
  },
  signerName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold'
  },
  signerPhone: {
    fontSize: 8,
    marginTop: 2
  }
})

const TABLE_HEADERS = [
  { key: 'item', label: 'Ítem', style: styles.colItem },
  { key: 'desc', label: 'Descripción', style: styles.colDesc },
  { key: 'qty', label: 'Cantidad', style: styles.colQty },
  { key: 'unit', label: 'Unidad', style: styles.colUnit },
  { key: 'unitPrice', label: 'Valor unitario', style: [styles.colMoney, styles.right] },
  { key: 'total', label: 'Valor total', style: [styles.colMoney, styles.right] },
  { key: 'delivery', label: 'Tiempo de entrega', style: styles.colDelivery },
  { key: 'notes', label: 'Observaciones', style: styles.colNotes }
] as const

export function QuotationPdfDocument({
  quotation,
  customer,
  logoSrc,
  referenceImages
}: {
  quotation: Quotation
  customer: Customer | null
  logoSrc: string
  referenceImages: string[]
}) {
  const subtotal = getQuotationSubtotal(quotation.items)
  const title = [
    'COTIZACIÓN',
    quotation.clientReference,
    quotation.subject
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Document
      title={`Cotización ${quotation.number}`}
      author={COMPANY.name}
    >
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Image src={logoSrc} style={styles.logo} />
            <Text style={styles.companyLine}>NIT: {COMPANY.nit}</Text>
            <Text style={styles.companyLine}>
              {COMPANY.address} {COMPANY.city.toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.quotationNumber}>
              COTIZACIÓN No {quotation.number}
            </Text>
          </View>
        </View>

        <Text style={styles.dateLine}>
          {formatLetterDate(quotation.date, COMPANY.city)}
        </Text>

        <Text style={styles.party}>
          <Text style={styles.partyLabel}>SEÑORES: </Text>
          {customer?.name ?? 'Cliente'}
        </Text>
        <Text style={styles.party}>
          <Text style={styles.partyLabel}>ATENCIÓN: </Text>
          {quotation.contactName}
        </Text>
        <Text style={styles.party}>{quotation.contactRole}</Text>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.body}>
          <View style={styles.tableWrap}>
            <View style={styles.tableHeader} wrap={false}>
              {TABLE_HEADERS.map((column) => (
                <Text
                  key={column.key}
                  style={[styles.headerCell, column.style]}
                >
                  {column.label}
                </Text>
              ))}
            </View>
            {quotation.items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.striped : {}
                ]}
                wrap={false}
              >
                <Text style={[styles.cell, styles.colItem]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.colDesc]}>
                  {item.description}
                </Text>
                <Text style={[styles.cell, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.cell, styles.colUnit]}>{item.unit}</Text>
                <Text style={[styles.cell, styles.colMoney, styles.right]}>
                  {formatCOP(item.unitPrice)}
                </Text>
                <Text style={[styles.cell, styles.colMoney, styles.right]}>
                  {formatCOP(getLineTotal(item.quantity, item.unitPrice))}
                </Text>
                <Text style={[styles.cell, styles.colDelivery]}>
                  {item.deliveryTime}
                </Text>
                <Text style={[styles.cell, styles.colNotes]}>
                  {item.observations || ''}
                </Text>
              </View>
            ))}

            <View style={styles.totals}>
              <View style={styles.totalsBox}>
                <Text style={styles.totalLabel}>SUBTOTAL COP</Text>
                <Text style={styles.totalValue}>{formatCOP(subtotal)}</Text>
              </View>
            </View>
          </View>

          {referenceImages.length > 0 ? (
            <View style={styles.imagesColumn}>
              {referenceImages.map((src, index) => (
                <View key={`${src}-${index}`} style={styles.imageCard} wrap={false}>
                  <Image src={src} style={styles.referenceImage} />
                  <Text style={styles.imageCaption}>Imagen de referencia</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.conditions}>
          <Text style={styles.condition}>
            FORMA DE PAGO: {quotation.paymentTerms.toUpperCase()}
          </Text>
          <Text style={styles.condition}>
            {quotation.pricesPlusVat ? 'PRECIOS MÁS IVA' : 'PRECIOS INCLUYEN IVA'}
          </Text>
          <Text style={styles.condition}>
            LUGAR DE ENTREGA: {quotation.deliveryPlace.toUpperCase()}
          </Text>
          <Text style={styles.condition}>
            VALIDEZ DE LA OFERTA: {quotation.validityDays} DÍAS
          </Text>
        </View>

        <View style={styles.signature}>
          <Text style={styles.signatureLabel}>ATENTAMENTE</Text>
          <Text style={styles.signerName}>
            {quotation.signerName.toUpperCase()}
          </Text>
          <Text style={styles.signerPhone}>{quotation.signerPhone}</Text>
        </View>
      </Page>
    </Document>
  )
}
