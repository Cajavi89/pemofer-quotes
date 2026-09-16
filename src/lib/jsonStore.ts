import { promises as fs } from 'fs'
import path from 'path'

const dataDirectory = path.join(process.cwd(), 'src/data')

export async function readCollection<T>(fileName: string): Promise<T> {
  const raw = await fs.readFile(path.join(dataDirectory, fileName), 'utf8')
  return JSON.parse(raw) as T
}

export async function writeCollection(fileName: string, value: unknown) {
  await fs.writeFile(
    path.join(dataDirectory, fileName),
    `${JSON.stringify(value, null, 2)}\n`,
    'utf8'
  )
}
