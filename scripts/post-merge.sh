#!/bin/bash
set -e

echo "Running post-merge setup..."

if [ -f "package.json" ]; then
  echo "Installing dependencies..."
  npm install --prefer-offline --no-audit --no-fund < /dev/null
fi

echo "Post-merge setup complete."
