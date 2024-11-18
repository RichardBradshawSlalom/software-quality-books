'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookSchema } from '@/lib/validations/book'
import { ZodIssue } from 'zod'

interface BookFormProps {
  initialData?: {
    id?: string
    title: string
    description: string
  }
  isEditing?: boolean
  returnUrl?: string
}

export default function BookForm({ 
  initialData, 
  isEditing = false,
  returnUrl = '/books'
}: BookFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    }

    try {
      BookSchema.parse(data)
      setFieldErrors({})

      const response = await fetch(
        isEditing ? `/api/books/${initialData?.id}` : '/api/books',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      router.push(returnUrl || '/books')
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'ZodError') {
          const zodErrors = JSON.parse(error.message) as ZodIssue[]
          const newErrors: Record<string, string> = {}
          
          zodErrors.forEach((err: ZodIssue) => {
            if (err.path[0]) {
              const fieldName = err.path[0].toString()
              newErrors[fieldName] = err.message || `Invalid ${fieldName}`
            }
          })
          
          setFieldErrors(newErrors)
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={initialData?.title}
          className="w-full px-3 py-2 border rounded-lg"
        />
        {fieldErrors.title && (
          <p className="text-sm text-red-500">{fieldErrors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={initialData?.description}
          className="w-full px-3 py-2 border rounded-lg"
        />
        {fieldErrors.description && (
          <p className="text-sm text-red-500">{fieldErrors.description}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isEditing ? 'Update Book' : 'Create Book'}
      </button>
    </form>
  )
} 