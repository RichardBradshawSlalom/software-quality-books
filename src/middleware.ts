import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  console.log(`[Middleware] ${req.method} ${req.nextUrl.pathname} - Request received`)
  console.log(`Request body: ${req.body}`)
  console.log(`Request headers: ${req.headers}`)
  const response = NextResponse.next()
  console.log(`Response body: ${response.body}`)
  return response
}

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/books/new', '/books/edit/:path*', '/api/books/:path*/edit', '/api/books/new'],
}
