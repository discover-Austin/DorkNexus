#!/usr/bin/env node
/**
 * DorkNexus Deployment Script
 * Cross-platform Node.js version - works on Windows, macOS, and Linux
 * Builds and prepares the application for deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
  console.log('');
}

function logError(message) {
  log(`Error: ${message}`, colors.red);
}

function logSuccess(message) {
  log(message, colors.green);
}

function execCommand(command, errorMessage) {
  try {
    execSync(command, {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: true
    });
  } catch (error) {
    logError(errorMessage);
    process.exit(1);
  }
}

function getNodeMajorVersion() {
  const version = process.version;
  return parseInt(version.slice(1).split('.')[0]);
}

async function main() {
  console.log('');
  console.log('========================================');
  console.log('  DorkNexus Deployment Script');
  console.log('========================================');
  console.log('');

  // Check Node.js version
  logStep(1, 4, 'Checking environment...');
  const nodeMajorVersion = getNodeMajorVersion();
  if (nodeMajorVersion < 18) {
    logError(`Node.js 18+ is required. Current version: ${process.version}`);
    process.exit(1);
  }

  // Check for API key
  const envLocalPath = path.join(PROJECT_ROOT, '.env.local');
  if (!fs.existsSync(envLocalPath)) {
    log('Warning: .env.local not found. Checking for GEMINI_API_KEY...', colors.yellow);
    if (!process.env.GEMINI_API_KEY) {
      logError('GEMINI_API_KEY is not set.');
      console.log('Please create .env.local with your API key or set GEMINI_API_KEY environment variable.');
      process.exit(1);
    }
  }
  console.log('       Environment OK');
  console.log('');

  // Install dependencies
  logStep(2, 4, 'Installing dependencies...');
  execCommand(
    'npm install --production=false',
    'Failed to install dependencies'
  );
  console.log('       Dependencies installed');
  console.log('');

  // Build production bundle
  logStep(3, 4, 'Building production bundle...');
  execCommand(
    'npm run build',
    'Build failed'
  );
  console.log('       Build complete');
  console.log('');

  // Verify build
  logStep(4, 4, 'Verifying build...');
  const distDir = path.join(PROJECT_ROOT, 'dist');
  const distIndexPath = path.join(distDir, 'index.html');

  if (fs.existsSync(distDir) && fs.existsSync(distIndexPath)) {
    console.log('       Build verified');
  } else {
    logError('Build verification failed. dist/index.html not found.');
    process.exit(1);
  }

  console.log('');
  console.log('========================================');
  console.log('  Build Complete!');
  console.log('========================================');
  console.log('');
  console.log('Production files are in: ./dist/');
  console.log('');
  console.log('Deployment options:');
  console.log('  1. Upload \'dist/\' folder to static hosting (Vercel, Netlify, etc.)');
  console.log('  2. Run \'npm run preview\' to test locally');
  console.log('  3. Copy \'dist/\' to your web server\'s public directory');
  console.log('');
  console.log('Remember to set GEMINI_API_KEY in your hosting environment!');
  console.log('');
}

main().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
