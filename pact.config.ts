import { PactConfig } from '@pact-foundation/pact'
import path from 'path'

const config: PactConfig = {
  consumer: 'BooksFrontend',
  provider: 'BooksAPI',
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'warn',
  spec: 3,
}

export default config 