import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  if (!isValidAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll('files').filter((item): item is File => item instanceof File)

  if (files.length === 0) {
    return NextResponse.json({ error: 'No images selected' }, { status: 400 })
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
  await mkdir(uploadDir, { recursive: true })

  const urls: string[] = []

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP, and GIF images are allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Each image must be under 5MB' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadDir, filename), buffer)
    urls.push(`/uploads/products/${filename}`)
  }

  return NextResponse.json({ urls })
}
