import { promises as fs } from 'fs'
import path from 'path'

const publicRoot = path.join(process.cwd(), 'public')

export function resolvePublicFile(url: string) {
  if (!url.startsWith('/')) return null

  const relative = url.replace(/^\/+/, '')
  const absolute = path.normalize(path.join(publicRoot, relative))

  if (!absolute.startsWith(publicRoot)) return null
  return absolute
}

export async function fileToDataUri(filePath: string) {
  const buffer = await fs.readFile(filePath)
  const extension = path.extname(filePath).slice(1).toLowerCase()
  const mime = extension === 'jpg' || extension === 'jpeg' ? 'jpeg' : 'png'
  return `data:image/${mime};base64,${buffer.toString('base64')}`
}
