import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin'

export const runtime = 'nodejs'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
const MAX_SIZE = 8 * 1024 * 1024

function isImageFile(item: FormDataEntryValue): item is File {
  return typeof File !== 'undefined' && item instanceof File && item.size > 0
}

function isImageBlob(item: FormDataEntryValue): item is Blob & { name?: string } {
  return typeof Blob !== 'undefined' && item instanceof Blob && item.size > 0 && !(item instanceof File)
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    if (!isValidAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized. Please log in again.' }, { status: 401 })
    }

    const formData = await request.formData()
    const entries = formData.getAll('files')

    const files = entries.filter(isImageFile)
    const blobs = entries.filter(isImageBlob)

    if (files.length === 0 && blobs.length === 0) {
      return NextResponse.json({ error: 'No images selected' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    await mkdir(uploadDir, { recursive: true })

    const urls: string[] = []
    const allItems: Array<{ blob: Blob; name: string; type: string }> = [
      ...files.map((file) => ({ blob: file, name: file.name, type: file.type })),
      ...blobs.map((blob, i) => ({
        blob,
        name: blob.name || `image-${i}.jpg`,
        type: blob.type,
      })),
    ]

    for (const item of allItems) {
      const type = item.type || guessTypeFromName(item.name)
      if (!ALLOWED_TYPES.includes(type) && !isAllowedByExtension(item.name)) {
        return NextResponse.json(
          { error: 'Only JPG, PNG, WEBP, and GIF images are allowed' },
          { status: 400 }
        )
      }
      if (item.blob.size > MAX_SIZE) {
        return NextResponse.json({ error: 'Each image must be under 8MB' }, { status: 400 })
      }

      const ext = item.name.split('.').pop()?.toLowerCase() || extensionFromType(type)
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const buffer = Buffer.from(await item.blob.arrayBuffer())
      await writeFile(path.join(uploadDir, filename), buffer)
      urls.push(`/uploads/products/${filename}`)
    }

    return NextResponse.json({ urls })
  } catch (err: any) {
    console.error('Upload failed:', err)
    return NextResponse.json(
      { error: err?.message || 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}

function guessTypeFromName(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'gif') return 'image/gif'
  return ''
}

function isAllowedByExtension(name: string) {
  return /\.(jpe?g|png|webp|gif)$/i.test(name)
}

function extensionFromType(type: string) {
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  if (type === 'image/gif') return 'gif'
  return 'jpg'
}
