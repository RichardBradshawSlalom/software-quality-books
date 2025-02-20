import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { BookCard } from '@/components/BookCard'
import { faker } from '@faker-js/faker'
import { generateTestId, TEST_DATA_IDS } from '@/utils/idHelpers'

// Mock Next.js Link component
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('BookCard', () => {
  const mockBook = {
    id: faker.string.uuid(),
    title: 'Test Book Title',
    description: 'Test book description',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    userId: faker.string.uuid()
  }

  beforeEach(() => {
    console.log('\nTest Data:', JSON.stringify(mockBook, null, 2));
  });

  it('renders book information correctly', () => {
    render(<BookCard book={mockBook} />)
    screen.debug();

    // Check if the component renders with correct test ID
    const bookCard = screen.getByTestId(
      generateTestId(TEST_DATA_IDS.BOOK_CARD, mockBook.title)
    )
    expect(bookCard).toBeInTheDocument()

    // Check title
    expect(screen.getByRole('heading')).toHaveTextContent(mockBook.title)

    // Check description
    expect(screen.getByText(mockBook.description)).toBeInTheDocument()

    // Check date
    const expectedDate = new Date(mockBook.createdAt).toLocaleDateString()
    expect(screen.getByTestId('date-created')).toHaveTextContent(expectedDate)
  })

  it('renders links with correct hrefs', () => {
    render(<BookCard book={mockBook} />)
    screen.debug();

    // Check title link
    const titleLink = screen.getByRole('link', { name: mockBook.title })
    expect(titleLink).toHaveAttribute('href', `/books/${mockBook.id}`)

    // Check "Read more" link
    const readMoreLink = screen.getByRole('link', { name: /read more/i })
    expect(readMoreLink).toHaveAttribute('href', `/books/${mockBook.id}`)
  })
}) 