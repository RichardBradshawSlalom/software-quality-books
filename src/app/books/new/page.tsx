import BookForm from '@/components/BookForm'

export default function NewBookPage() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      <BookForm />
    </div>
  )
} 