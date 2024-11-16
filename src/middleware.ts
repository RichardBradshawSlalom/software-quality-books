import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/login',
  }
})

export const config = {
  matcher: [
    '/books/new',
    '/books/edit/:path*',
    '/api/books/:path*/edit',
    '/api/books/new',
  ]
} 