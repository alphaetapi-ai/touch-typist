#!/bin/bash
set -ueo pipefail

# Build TypeScript and React bundle
echo "Building project..."
npm run build

# Create AWS package - exclude source files, dev dependencies, and development artifacts
zip -r aws-pack.zip . -x "*.git*" "node_modules/*" "src/*" "*.ts" "*.tsx" "tsconfig.json" "webpack.config.js" "keyboard-layouts/*" "practice-files/*"

echo "AWS package created: aws-pack.zip"