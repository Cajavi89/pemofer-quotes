import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MAX_FILE_BYTES = 4 * 1024 * 1024
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Adjunta una imagen' }, { status: 400 })
  }

  const extension = ALLOWED_TYPES[file.type]
  if (!extension) {
    return NextResponse.json(
      { error: 'Solo se permiten imágenes JPG o PNG' },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: 'La imagen no puede superar 4 MB' },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `${randomUUID()}.${extension}`
  const directory = path.join(process.cwd(), 'public/uploads/quotations')
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(path.join(directory, fileName), buffer)

  return NextResponse.json({ url: `/uploads/quotations/${fileName}` })
}
