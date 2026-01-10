# Parallax - Electron Desktop App

Welcome to **Parallax**, the standalone Electron desktop version of DorkNexus! This guide will help you set up, develop, and package the application for Windows, macOS, and Linux.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Packaging for Distribution](#packaging-for-distribution)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Parallax is a powerful desktop application built with:
- **Electron** - Cross-platform desktop framework
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Electron Forge** - Complete build and packaging solution
- **electron-store** - Secure persistent storage

### Key Features

✅ Standalone desktop app (no browser required)
✅ Secure data storage with encryption
✅ Native system integration
✅ Cross-platform support (Windows, macOS, Linux)
✅ Auto-updates ready
✅ Single instance lock

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 8.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

**Platform-specific requirements:**

### Windows
- Windows 10/11
- .NET Framework 4.5+ (for building installers)

### macOS
- macOS 10.13 or later
- Xcode Command Line Tools: `xcode-select --install`

### Linux
- Ubuntu 18.04+, Debian 10+, Fedora 36+, or similar
- Required packages:
  ```bash
  sudo apt-get install -y libnss3 libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libasound2
  ```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/discover-Austin/DorkNexus.git
   cd DorkNexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY if needed
   ```

## 💻 Development

### Run in Development Mode

Start the Electron app with hot-reload:

```bash
npm run electron:dev
```

This command:
1. Starts Vite dev server on `http://localhost:3000`
2. Launches Electron with DevTools open
3. Enables hot-reload for React components

### Alternative: Run Components Separately

**Terminal 1** - Start Vite dev server:
```bash
npm run dev
```

**Terminal 2** - Start Electron:
```bash
npm run electron:start
```

### Development Tips

- **DevTools**: Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Opt+I` (macOS)
- **Reload**: Press `Ctrl+R` (Windows/Linux) or `Cmd+R` (macOS)
- **Console**: Check both main process console (terminal) and renderer console (DevTools)

## 🔨 Building

### Build React App Only

```bash
npm run build
```

This creates a production build in the `dist/` folder.

### Build Electron Package

Package the app (without creating installers):

```bash
npm run electron:package
```

Output: `out/parallax-{platform}-{arch}/`

## 📦 Packaging for Distribution

### All Platforms

Create installers for all platforms:

```bash
npm run electron:make
```

### Platform-Specific

**Windows** (.exe installer + portable .zip):
```bash
npm run electron:make:win
```

Output:
- `out/make/squirrel.windows/x64/ParallaxSetup.exe` - Installer
- `out/make/zip/win32/x64/parallax-win32-x64-1.0.0.zip` - Portable

**macOS** (.dmg installer + .zip):
```bash
npm run electron:make:mac
```

Output:
- `out/make/dmg/x64/Parallax-1.0.0.dmg` - Disk image
- `out/make/zip/darwin/x64/parallax-darwin-x64-1.0.0.zip` - Portable

**Linux** (.deb, .rpm, .zip):
```bash
npm run electron:make:linux
```

Output:
- `out/make/deb/x64/parallax_1.0.0_amd64.deb` - Debian/Ubuntu package
- `out/make/rpm/x64/parallax-1.0.0-1.x86_64.rpm` - RedHat/Fedora package
- `out/make/zip/linux/x64/parallax-linux-x64-1.0.0.zip` - Portable

### Installing Built Packages

**Windows:**
```bash
# Run the installer
ParallaxSetup.exe

# Or extract and run portable version
unzip parallax-win32-x64-1.0.0.zip
cd parallax-win32-x64
parallax.exe
```

**macOS:**
```bash
# Open the DMG and drag to Applications
open Parallax-1.0.0.dmg

# Or use CLI
hdiutil attach Parallax-1.0.0.dmg
cp -r "/Volumes/Parallax/Parallax.app" /Applications/
```

**Linux (Debian/Ubuntu):**
```bash
sudo dpkg -i parallax_1.0.0_amd64.deb
# Or
sudo apt install ./parallax_1.0.0_amd64.deb
```

**Linux (RedHat/Fedora):**
```bash
sudo rpm -i parallax-1.0.0-1.x86_64.rpm
# Or
sudo dnf install parallax-1.0.0-1.x86_64.rpm
```

## 🏗 Architecture

### Project Structure

```
DorkNexus/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script (IPC bridge)
├── components/          # React components
├── services/            # Business logic
├── utils/               # Utility functions
├── dist/                # Built React app (generated)
├── out/                 # Packaged apps (generated)
├── forge.config.js      # Electron Forge configuration
├── vite.config.ts       # Vite configuration
├── package.json         # Dependencies and scripts
└── electron-types.d.ts  # TypeScript definitions

```

### How It Works

1. **Main Process** (`electron/main.js`)
   - Creates browser window
   - Manages app lifecycle
   - Handles IPC communication
   - Manages electron-store

2. **Preload Script** (`electron/preload.js`)
   - Exposes secure APIs to renderer
   - Bridges main ↔ renderer communication
   - Provides storage abstraction

3. **Renderer Process** (React app)
   - Runs in the Electron window
   - Uses exposed APIs via `window.electronStore`
   - Maintains existing React code

### Storage Migration

**Before (localStorage):**
```typescript
localStorage.setItem('key', value);
const data = localStorage.getItem('key');
```

**After (electron-store):**
```typescript
await window.electronStore.set('key', value);
const data = await window.electronStore.get('key');
```

The `NexusVault` component has been updated with a storage abstraction layer that works with both localStorage (browser) and electron-store (desktop).

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot find module 'electron'"**
```bash
npm install
```

**2. Port 3000 already in use**
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

**3. Build fails on macOS**
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

**4. Linux: Missing dependencies**
```bash
sudo apt-get install -y libnss3 libgconf-2-4 libatk1.0-0 \
  libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libasound2
```

**5. "npm run electron:dev" opens blank window**
- Wait a few seconds for Vite to compile
- Check terminal for errors
- Ensure port 3000 is accessible

**6. Data not persisting**
- Check that you're using `await` with storage methods
- Verify `electron-store` is installed
- Check for errors in DevTools console

### Debug Mode

Enable verbose logging:
```bash
# Windows
set DEBUG=electron-forge:*
npm run electron:dev

# macOS/Linux
DEBUG=electron-forge:* npm run electron:dev
```

### Clean Build

If you encounter persistent issues:
```bash
# Remove all build artifacts and dependencies
npm run clean
rm -rf out/

# Reinstall
npm install

# Rebuild
npm run build
npm run electron:package
```

## 📝 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server only |
| `npm run build` | Build React app for production |
| `npm run electron:dev` | Run Electron in development mode |
| `npm run electron:start` | Start Electron (requires built app) |
| `npm run electron:build` | Build React app and package Electron |
| `npm run electron:package` | Package Electron app (no installer) |
| `npm run electron:make` | Create installers for all platforms |
| `npm run electron:make:win` | Create Windows installer |
| `npm run electron:make:mac` | Create macOS installer |
| `npm run electron:make:linux` | Create Linux packages |
| `npm run clean` | Remove build artifacts |

## 🔒 Security

Parallax implements security best practices:

- ✅ Context isolation enabled
- ✅ Node integration disabled in renderer
- ✅ Sandbox mode enabled
- ✅ Preload script for secure IPC
- ✅ Content Security Policy
- ✅ Encrypted data storage
- ✅ Single instance lock
- ✅ External links open in default browser

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/discover-Austin/DorkNexus/issues
- Documentation: See SUPPORT.md

---

**Built with ❤️ by the Parallax Team**
