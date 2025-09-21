#!/bin/bash

echo "🚀 Quick Deploy to GitHub Pages..."

# Install gh-pages if not present
if ! command -v gh-pages &> /dev/null; then
    echo "📦 Installing gh-pages..."
    npm install -g gh-pages
fi

# Build without type checking
echo "🏗️ Building project..."
export NODE_ENV=production
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npx gh-pages -d dist -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"

if [ $? -eq 0 ]; then
    echo "✅ Deploy successful!"
    echo "🔗 Your app will be available at: https://tuyenp1919-alt.github.io/salebds/"
    echo "⏳ Note: GitHub Pages may take a few minutes to update."
else
    echo "❌ Deploy failed!"
    exit 1
fi