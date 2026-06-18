import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/overview', request.url))
  }

  // 範例：輕量化檢查是否有登入 Cookie (雙層安全機制的第一線)
  const token = request.cookies.get('token')?.value

  if (!token && request.nextUrl.pathname.startsWith('/overview')) {
    // 重新導向到登入頁
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
