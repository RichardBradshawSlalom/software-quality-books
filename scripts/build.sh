#!/bin/bash

# Check if we're in production
if [ "$VERCEL_ENV" = "production" ]; then
  # Use the production schema
  cp prisma/schema.production.prisma prisma/schema.prisma
fi

# Generate Prisma Client
npx prisma generate

# Build Next.js
next build 