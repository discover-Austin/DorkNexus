#!/bin/bash
# DorkNexus Distribution Packaging Script
# Creates a clean zip file for distribution to customers

set -e

# Configuration
VERSION="1.0.0"
PACKAGE_NAME="dorknexus-v${VERSION}"
OUTPUT_DIR="./dist-packages"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║    DorkNexus Distribution Packager v1.0        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

# Create output directory
echo -e "${YELLOW}[1/5]${NC} Creating output directory..."
mkdir -p "$OUTPUT_DIR"
TEMP_DIR=$(mktemp -d)
PACKAGE_DIR="${TEMP_DIR}/${PACKAGE_NAME}"
mkdir -p "$PACKAGE_DIR"

# Copy source files (excluding unwanted files)
echo -e "${YELLOW}[2/5]${NC} Copying source files..."
cp -r \
    App.tsx \
    index.tsx \
    index.html \
    types.ts \
    constants.tsx \
    vite.config.ts \
    tsconfig.json \
    package.json \
    package-lock.json 2>/dev/null || true \
    metadata.json \
    LICENSE \
    README.md \
    INSTALLATION.md \
    CHANGELOG.md \
    SUPPORT.md \
    SECURITY.md \
    PRIVACY.md \
    .env.example \
    .gitignore \
    .npmrc \
    setup.js \
    "$PACKAGE_DIR/"

# Copy directories
cp -r components "$PACKAGE_DIR/"
cp -r services "$PACKAGE_DIR/"
cp -r utils "$PACKAGE_DIR/"
cp -r scripts "$PACKAGE_DIR/"

# Remove the package script from distributed version (meta!)
rm -f "$PACKAGE_DIR/scripts/package.sh"

# Create the zip file
echo -e "${YELLOW}[3/5]${NC} Creating zip archive..."
cd "$TEMP_DIR"
zip -r "${PACKAGE_NAME}.zip" "$PACKAGE_NAME" -x "*.DS_Store" -x "*__MACOSX*"
cd - > /dev/null

# Move to output directory
echo -e "${YELLOW}[4/5]${NC} Moving package to output directory..."
mv "${TEMP_DIR}/${PACKAGE_NAME}.zip" "${OUTPUT_DIR}/"

# Cleanup
echo -e "${YELLOW}[5/5]${NC} Cleaning up..."
rm -rf "$TEMP_DIR"

# Calculate file size
FILE_SIZE=$(du -h "${OUTPUT_DIR}/${PACKAGE_NAME}.zip" | cut -f1)

# Success message
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Package Created Successfully!         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${CYAN}Package:${NC}  ${OUTPUT_DIR}/${PACKAGE_NAME}.zip"
echo -e "  ${CYAN}Size:${NC}     ${FILE_SIZE}"
echo -e "  ${CYAN}Version:${NC}  ${VERSION}"
echo ""
echo -e "${YELLOW}Contents excluded from package:${NC}"
echo "  - node_modules/"
echo "  - .git/"
echo "  - .env.local (customer's API key)"
echo "  - dist/ (build output)"
echo "  - scripts/package.sh (this script)"
echo ""
echo -e "${GREEN}Ready for distribution!${NC}"
echo ""
