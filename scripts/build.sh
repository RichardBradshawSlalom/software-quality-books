#!/bin/bash

# Check if we're in production (Vercel)
if [ "$VERCEL_ENV" = "production" ]; then
  echo "Running production build..."
  
  # Copy production schema
  cp prisma/schema.production.prisma prisma/schema.prisma
  
  # Generate Prisma client
  npx prisma generate
  
  # Build Next.js
  next build
else
  echo "Running development build..."
  
  # Use default schema (SQLite)
  npx prisma generate
  next build
fi 