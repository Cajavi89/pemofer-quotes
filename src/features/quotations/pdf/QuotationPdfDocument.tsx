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
  getQuotationAmounts,
  VAT_PERCENT
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
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: navy,
    color: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 3
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D6D3CD',
    minHeight: 42
  },
  striped: {
    backgroundColor: stripe
  },
  colItem: { width: '4%', paddingRight: 3 },
  colPhoto: { width: '10%', paddingRight: 3, flexDirection: 'row', gap: 2 },
  colDesc: { width: '22%', paddingRight: 3 },
  colQty: { width: '8%', paddingRight: 3 },
  colUnit: { width: '8%', paddingRight: 3 },
  colMoney: { width: '12%', paddingRight: 3 },
  colDelivery: { width: '11%', paddingRight: 3 },
  colNotes: { width: '13%' },
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
  thumbWrap: {
    width: 36,
    height: 36,
    overflow: 'hidden'
  },
  thumb: {
    width: 36,
    height: 36,
    objectFit: 'contain'
  },
  totals: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  totalsBox: {
    minWidth: 200,
    gap: 2
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16
  },
  totalLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold'
  },
  totalMuted: {
    fontSize: 8
  },
  totalValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold'
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
  { key: 'photo', label: 'Foto', style: styles.colPhoto },
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
  itemImages
}: {
  quotation: Quotation
  customer: Customer | null
  logoSrc: string
  itemImages: Record<string, string[]>
}) {
  const { subtotal, vatAmount, total } = getQuotationAmounts(
    quotation.items,
    quotation.pricesPlusVat
  )
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

        <View style={styles.tableHeader} wrap={false}>
          {TABLE_HEADERS.map((column) => (
            <Text key={column.key} style={[styles.headerCell, column.style]}>
              {column.label}
            </Text>
          ))}
        </View>
        {quotation.items.map((item, index) => {
          const images = (itemImages[item.id] ?? []).slice(0, 2)
          return (
            <View
              key={item.id}
              style={[styles.tableRow, index % 2 === 1 ? styles.striped : {}]}
              wrap={false}
            >
              <Text style={[styles.cell, styles.colItem]}>{index + 1}</Text>
              <View style={styles.colPhoto}>
                {images.map((src) => (
                  <View key={src} style={styles.thumbWrap} wrap={false}>
                    <Image src={src} style={styles.thumb} />
                  </View>
                ))}
              </View>
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
          )
        })}

        <View style={styles.totals}>
          <View style={styles.totalsBox}>
            {quotation.pricesPlusVat ? (
              <>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>SUBTOTAL</Text>
                  <Text style={styles.totalMuted}>{formatCOP(subtotal)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>IVA ({VAT_PERCENT}%)</Text>
                  <Text style={styles.totalMuted}>{formatCOP(vatAmount)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTAL COP</Text>
                  <Text style={styles.totalValue}>{formatCOP(total)}</Text>
                </View>
              </>
            ) : (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL COP</Text>
                <Text style={styles.totalValue}>{formatCOP(subtotal)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.conditions}>
          <Text style={styles.condition}>
            FORMA DE PAGO: {quotation.paymentTerms.toUpperCase()}
          </Text>
          <Text style={styles.condition}>
            {quotation.pricesPlusVat
              ? `INCLUYE IVA (${VAT_PERCENT}%) EN LOS VALORES`
              : 'NO INCLUYE IVA EN LOS VALORES'}
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
