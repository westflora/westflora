import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, getAdminToken, isValidAdminPassword } from '@/lib/admin'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!password || !isValidAdminPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, getAdminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
