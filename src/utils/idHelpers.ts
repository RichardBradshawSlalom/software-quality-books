export const TEST_DATA_IDS = {
  BOOK_CARD: 'book-card'
} as const;

export function generateTestId(prefix: string, value: string): string {
  const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${prefix}-${sanitizedValue}`;
} 