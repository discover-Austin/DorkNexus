#!/bin/bash
# DorkNexus Deployment Script
# Run this script to build and prepare for deployment

set -e

echo "========================================"
echo "  DorkNexus Deployment Script"
echo "========================================"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "[1/4] Checking environment..."
if [ ! -f ".env.local" ]; then
    echo "Warning: .env.local not found. Checking for GEMINI_API_KEY..."
    if [ -z "$GEMINI_API_KEY" ]; then
        echo "Error: GEMINI_API_KEY is not set."
        echo "Please create .env.local with your API key or set GEMINI_API_KEY environment variable."
        exit 1
    fi
fi
echo "       Environment OK"

echo "[2/4] Installing dependencies..."
npm install --production=false
echo "       Dependencies installed"

echo "[3/4] Building production bundle..."
npm run build
echo "       Build complete"

echo "[4/4] Verifying build..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "       Build verified"
else
    echo "Error: Build verification failed. dist/index.html not found."
    exit 1
fi

echo ""
echo "========================================"
echo "  Build Complete!"
echo "========================================"
echo ""
echo "Production files are in: ./dist/"
echo ""
echo "Deployment options:"
echo "  1. Upload 'dist/' folder to static hosting (Vercel, Netlify, etc.)"
echo "  2. Run 'npm run preview' to test locally"
echo "  3. Copy 'dist/' to your web server's public directory"
echo ""
echo "Remember to set GEMINI_API_KEY in your hosting environment!"
