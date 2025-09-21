#!/bin/bash

# SaleBDS Deploy Script
# This script builds the app and deploys to GitHub Pages

set -e

echo "🏠 Starting SaleBDS deployment..."

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. It's recommended to commit them first."
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    print_warning "You're not on the main branch (currently on: $current_branch)"
    read -p "Continue deployment? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies if needed
print_status "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
else
    print_status "Dependencies already installed"
fi

# Run type checking
print_status "Running TypeScript type checking..."
if npm run type-check; then
    print_success "Type checking passed"
else
    print_error "Type checking failed"
    exit 1
fi

# Run linting
print_status "Running ESLint..."
if npm run lint; then
    print_success "Linting passed"
else
    print_warning "Linting failed, but continuing..."
fi

# Clean previous build
print_status "Cleaning previous build..."
rm -rf dist/

# Build the project
print_status "Building for production..."
export NODE_ENV=production
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
    print_error "Build output directory 'dist' not found"
    exit 1
fi

# Create CNAME file for custom domain (if configured)
if [ ! -z "$CUSTOM_DOMAIN" ]; then
    print_status "Creating CNAME file for custom domain: $CUSTOM_DOMAIN"
    echo "$CUSTOM_DOMAIN" > dist/CNAME
fi

# Create .nojekyll file to bypass Jekyll processing
touch dist/.nojekyll

# Add git attributes to handle GitHub Pages deployment
cat > dist/.gitattributes << EOF
# GitHub Pages deployment
* text=auto eol=lf
*.js text eol=lf
*.css text eol=lf
*.html text eol=lf
*.json text eol=lf
*.svg text eol=lf
EOF

# Deploy to GitHub Pages
print_status "Deploying to GitHub Pages..."

# Check if gh-pages is installed
if ! command -v gh-pages &> /dev/null; then
    print_status "Installing gh-pages..."
    npm install -g gh-pages
fi

# Deploy
if npx gh-pages -d dist -m "Deploy SaleBDS $(date '+%Y-%m-%d %H:%M:%S')"; then
    print_success "🚀 Deployment completed successfully!"
    print_success "Your app should be available at: https://$(git config --get remote.origin.url | sed 's/.*github.com[\/:]//g' | sed 's/.git$//g' | sed 's/\//.github.io\//g')"
else
    print_error "Deployment failed"
    exit 1
fi

# Show deployment info
echo ""
echo "================================================="
echo "🏠 SaleBDS Deployment Summary"
echo "================================================="
echo "✅ Build: Success"
echo "✅ Deploy: Success"
echo "📅 Date: $(date)"
echo "🌿 Branch: $current_branch"
echo "📦 Build size: $(du -sh dist | cut -f1)"
echo "🔗 URL: https://$(git config --get remote.origin.url | sed 's/.*github.com[\/:]//g' | sed 's/.git$//g' | sed 's/\//.github.io\//g')"
echo "================================================="
echo ""

# Optional: Open in browser
if command -v open &> /dev/null; then
    read -p "Open the deployed app in browser? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://$(git config --get remote.origin.url | sed 's/.*github.com[\/:]//g' | sed 's/.git$//g' | sed 's/\//.github.io\//g')"
    fi
fi

print_success "🎉 SaleBDS deployment completed!"