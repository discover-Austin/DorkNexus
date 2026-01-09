#!/usr/bin/env node
/**
 * DorkNexus Distribution Packaging Script
 * Cross-platform Node.js version - works on Windows, macOS, and Linux
 * Creates a clean zip file for distribution to customers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const VERSION = '1.0.0';
const PACKAGE_NAME = `dorknexus-v${VERSION}`;
const OUTPUT_DIR = './dist-packages';
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Colors for cross-platform terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, total, message) {
  log(`[${step}/${total}] ${message}`, colors.yellow);
}

function logError(message) {
  log(`Error: ${message}`, colors.red);
}

function logSuccess(message) {
  log(message, colors.green);
}

// Copy file or directory recursively
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Remove directory recursively
function removeRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Get file size in human-readable format
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const bytes = stats.size;
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)}${units[unitIndex]}`;
}

async function createZipArchive(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, path.basename(sourceDir));
    archive.finalize();
  });
}

async function main() {
  console.log('');
  log('╔════════════════════════════════════════════════╗', colors.cyan);
  log('║    DorkNexus Distribution Packager v1.0        ║', colors.cyan);
  log('╚════════════════════════════════════════════════╝', colors.cyan);
  console.log('');

  // Check if we're in the right directory
  const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    logError('package.json not found. Run this script from the project root.');
    process.exit(1);
  }

  // Create output directory
  logStep(1, 5, 'Creating output directory...');
  const outputDirPath = path.join(PROJECT_ROOT, OUTPUT_DIR);
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  // Create temp directory
  const tempDir = fs.mkdtempSync(path.join(process.cwd(), 'tmp-package-'));
  const packageDir = path.join(tempDir, PACKAGE_NAME);
  fs.mkdirSync(packageDir, { recursive: true });

  try {
    // Copy source files
    logStep(2, 5, 'Copying source files...');
    const filesToCopy = [
      'App.tsx',
      'index.tsx',
      'index.html',
      'types.ts',
      'constants.tsx',
      'vite.config.ts',
      'tsconfig.json',
      'package.json',
      'package-lock.json',
      'metadata.json',
      'LICENSE',
      'README.md',
      'INSTALLATION.md',
      'CHANGELOG.md',
      'SUPPORT.md',
      'SECURITY.md',
      'PRIVACY.md',
      '.env.example',
      '.gitignore',
      '.npmrc',
      'setup.js',
    ];

    for (const file of filesToCopy) {
      const srcPath = path.join(PROJECT_ROOT, file);
      if (fs.existsSync(srcPath)) {
        const destPath = path.join(packageDir, file);
        fs.copyFileSync(srcPath, destPath);
      }
    }

    // Copy directories
    const dirsToCopy = ['components', 'services', 'utils', 'scripts'];
    for (const dir of dirsToCopy) {
      const srcPath = path.join(PROJECT_ROOT, dir);
      if (fs.existsSync(srcPath)) {
        const destPath = path.join(packageDir, dir);
        copyRecursive(srcPath, destPath);
      }
    }

    // Remove the package scripts from distributed version
    const packageScriptPath = path.join(packageDir, 'scripts', 'package.sh');
    const packageScriptJsPath = path.join(packageDir, 'scripts', 'package.js');
    if (fs.existsSync(packageScriptPath)) {
      fs.unlinkSync(packageScriptPath);
    }
    if (fs.existsSync(packageScriptJsPath)) {
      fs.unlinkSync(packageScriptJsPath);
    }

    // Create the zip file
    logStep(3, 5, 'Creating zip archive...');
    const zipPath = path.join(outputDirPath, `${PACKAGE_NAME}.zip`);
    await createZipArchive(packageDir, zipPath);

    // Cleanup
    logStep(5, 5, 'Cleaning up...');
    removeRecursive(tempDir);

    // Calculate file size
    const fileSize = getFileSize(zipPath);

    // Success message
    console.log('');
    log('╔════════════════════════════════════════════════╗', colors.green);
    log('║           Package Created Successfully!         ║', colors.green);
    log('╚════════════════════════════════════════════════╝', colors.green);
    console.log('');
    log(`  Package:  ${OUTPUT_DIR}/${PACKAGE_NAME}.zip`, colors.cyan);
    log(`  Size:     ${fileSize}`, colors.cyan);
    log(`  Version:  ${VERSION}`, colors.cyan);
    console.log('');
    log('Contents excluded from package:', colors.yellow);
    console.log('  - node_modules/');
    console.log('  - .git/');
    console.log('  - .env.local (customer\'s API key)');
    console.log('  - dist/ (build output)');
    console.log('  - scripts/package.sh & scripts/package.js (packaging scripts)');
    console.log('');
    logSuccess('Ready for distribution!');
    console.log('');

  } catch (error) {
    logError(`Packaging failed: ${error.message}`);
    removeRecursive(tempDir);
    process.exit(1);
  }
}

main().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
