import { notFound } from 'next/navigation'
import BookForm from '@/components/BookForm'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function EditBookPage({ params }: { params: { id: string } }) {
  console.log('[LOG] - EditBookPage params:', params)
  const session = await getServerSession(authOptions)
  console.log('[LOG] - Session:', session)
  const book = await prisma.book.findUnique({
    where: { id: params.id },
  })
  console.log('[LOG] - Book fetched:', book)

  if (!book) {
    console.error('[ERROR] - Book not found for ', book)
    notFound()
  }

  // Redirect if not the owner
  if (book.userId !== session?.user?.id) {
    console.log('[LOG] - User is not the owner, redirecting to /books')
    redirect('/books')
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      <BookForm initialData={book} isEditing={true} returnUrl={`/books/${params.id}`} />
    </div>
  )
}
