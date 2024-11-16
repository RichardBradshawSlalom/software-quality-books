import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/login',
  }
})

export const config = {
  matcher: [
    '/books/:path*',  // Protect all routes under /books
    '/api/books/:path*'  // Protect all book API routes
  ]
} 