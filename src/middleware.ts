import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Don't touch API uploads / admin APIs — multipart bodies break in middleware
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    if (!isValidAdminToken(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (pathname === '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    if (isValidAdminToken(token)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !supabaseUrl.startsWith('http') || supabaseUrl.includes('placeholder')) {
    return NextResponse.next()
  }

  try {
    return await updateSession(request)
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|api/admin/upload|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
