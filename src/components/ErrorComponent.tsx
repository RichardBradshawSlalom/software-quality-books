import React from 'react'

interface ErrorComponentProps {
  message: string
}

export default function ErrorComponent({ message }: ErrorComponentProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Error</h1>
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">{message}</div>
    </div>
  )
}
