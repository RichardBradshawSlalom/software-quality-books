#!/bin/bash

# Directories for log files
LOG_DIR="./ci-logs"
BUILD_LOG="$LOG_DIR/build.log"
LINT_LOG="$LOG_DIR/lint.log"
E2E_TEST_LOG="$LOG_DIR/e2e-test.log"
VISUAL_TEST_LOG="$LOG_DIR/visual-test.log"
UNIT_TEST_LOG="$LOG_DIR/unit-test.log"
API_TEST_LOG="$LOG_DIR/api-test.log"
PRISMA_LOG="$LOG_DIR/prisma.log"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Check if we're in production (Vercel)
if [ "$VERCEL_ENV" = "production" ]; then
  echo "Running production build..."
  
  # Copy production schema
  cp prisma/schema.production.prisma prisma/schema.prisma
  
  # Generate Prisma client
  npx prisma generate
  
  # Push the schema to the database
  npx prisma db push --skip-generate
  
  # Build Next.js
  next build
else
  echo "Running development build..."

  echo "Installing dependencies..."
  npm ci > "$LOG_DIR/npm-install.log" 2>&1
  if [ $? -ne 0 ]; then
    echo "Dependency installation failed. Check $LOG_DIR/npm-install.log"
    exit 1
  fi

  echo "Building the project..."
  npx next build > "$BUILD_LOG" 2>&1
  if [ $? -ne 0 ]; then
    echo "Build failed. Check $BUILD_LOG"
    exit 1
  fi

  echo "Generating Prisma client..."
  npx prisma generate > "$PRISMA_LOG" 2>&1
  if [ $? -ne 0 ]; then
    echo "Prisma client generation failed. Check $PRISMA_LOG"
    exit 1
  fi

  echo "Running lint checks..."
  npm run lint > "$LINT_LOG" 2>&1
  if [ $? -ne 0 ]; then
    echo "Linting failed. Check $LINT_LOG"
    exit 1
  fi

  echo "Running e2e tests..."
  npm run test:e2e > "$E2E_TEST_LOG" 2>&1
  if [ $? -ne 0 ]; then
    echo "e2e tests failed. Check $E2E_TEST_LOG"
    exit 1
  fi

  echo "Running visual tests..."
  npm run test:visual > "$VISUAL_TEST_LOG" 2>&1
  if [ $? -ne 0 ]; then
    echo "Visual tests failed. Check $VISUAL_TEST_LOG"
    exit 1
  fi

  echo "Running unit tests..."
  npm run test:unit > "$UNIT_TEST_LOG" 2>&1
  if [ $? -ne 0 ]; then
    echo "Unit tests failed. Check $UNIT_TEST_LOG"
    exit 1
  fi

  echo "Running API tests..."
  npm run test:api > "$API_TEST_LOG" 2>&1
  if [ $? -ne 0 ]; then
    echo "API tests failed. Check $API_TEST_LOG"
    exit 1
  fi
  
  echo "Development build completed successfully. Logs are in $LOG_DIR"
  exit 0  
fi 

