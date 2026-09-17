import { renderToBuffer } from '@react-pdf/renderer'
import type { Customer } from '@/features/customers/interfaces/customer'
import type { Quotation } from '@/features/quotations/interfaces/quotation'
import { QuotationPdfDocument } from '@/features/quotations/pdf/QuotationPdfDocument'
import { fileToDataUri, resolvePublicFile } from '@/lib/publicAssets'

const LOGO_PATH = '/logo-pemofer.png'

async function toPdfImageSrc(url: string) {
  const filePath = resolvePublicFile(url)
  if (!filePath) return null

  try {
    return await fileToDataUri(filePath)
  } catch {
    return null
  }
}

export async function renderQuotationPdf(
  quotation: Quotation,
  customer: Customer | null
) {
  const logoSrc = (await toPdfImageSrc(LOGO_PATH)) ?? LOGO_PATH
  const referenceImages = (
    await Promise.all(
      (quotation.referenceImageUrls ?? []).map((url) => toPdfImageSrc(url))
    )
  ).filter((src): src is string => Boolean(src))

  const buffer = await renderToBuffer(
    <QuotationPdfDocument
      quotation={quotation}
      customer={customer}
      logoSrc={logoSrc}
      referenceImages={referenceImages}
    />
  )

  return buffer
}

function fileNamePart(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

export function quotationPdfFileName(
  quotation: Quotation,
  customer: Customer | null
) {
  const clientName = fileNamePart(customer?.name ?? 'Cliente')

  return `COT-${quotation.number}-${clientName}-${quotation.date}.pdf`
}
