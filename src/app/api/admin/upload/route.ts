import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin'

export const runtime = 'nodejs'

const BUCKET = 'product-images'
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
const MAX_SIZE = 8 * 1024 * 1024

type UploadItem = {
  blob: Blob
  name: string
  type: string
}

function toUploadItems(entries: FormDataEntryValue[]): UploadItem[] {
  const items: UploadItem[] = []

  for (const [index, entry] of entries.entries()) {
    if (typeof entry === 'string') continue
    if (!(entry instanceof Blob) || entry.size <= 0) continue

    const file = entry as Blob & { name?: string; type: string }
    items.push({
      blob: entry,
      name: file.name || `image-${index}.jpg`,
      type: file.type || '',
    })
  }

  return items
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase is not configured')
  }
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    if (!isValidAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized. Please log in again.' }, { status: 401 })
    }

    const formData = await request.formData()
    const items = toUploadItems(formData.getAll('files'))

    if (items.length === 0) {
      return NextResponse.json({ error: 'No images selected' }, { status: 400 })
    }

    const supabase = getSupabase()
    const urls: string[] = []

    for (const item of items) {
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
      const path = `products/${filename}`
      const buffer = Buffer.from(await item.blob.arrayBuffer())

      const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
        contentType: type || 'image/jpeg',
        upsert: false,
      })

      if (error) {
        console.error('Storage upload failed:', error)
        return NextResponse.json(
          {
            error:
              error.message.includes('Bucket not found') || error.message.includes('not found')
                ? 'Storage bucket missing. Run supabase-storage.sql in your Supabase project.'
                : error.message,
          },
          { status: 500 }
        )
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      urls.push(data.publicUrl)
    }

    return NextResponse.json({ urls })
  } catch (err: unknown) {
    console.error('Upload failed:', err)
    const message = err instanceof Error ? err.message : 'Upload failed. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
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
