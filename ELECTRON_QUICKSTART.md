# Parallax - Quick Start Guide

🚀 **Get your Electron app running in 3 minutes!**

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Electron, Electron Forge, and electron-store.

## Step 2: Run Development Mode

```bash
npm run electron:dev
```

This starts both the Vite dev server and Electron app with hot-reload enabled.

**What you should see:**
- Terminal shows Vite dev server running on `http://localhost:3000`
- Electron window opens automatically
- DevTools are open by default

## Step 3: Build for Production

### Quick Package (no installer)

```bash
npm run electron:package
```

**Output:** `out/parallax-{platform}-{arch}/`

### Create Installers

**All platforms:**
```bash
npm run electron:make
```

**Windows only:**
```bash
npm run electron:make:win
```

**macOS only:**
```bash
npm run electron:make:mac
```

**Linux only:**
```bash
npm run electron:make:linux
```

## 📦 What Gets Built

### Windows
- `ParallaxSetup.exe` - Installer
- `parallax-win32-x64-{version}.zip` - Portable

### macOS
- `Parallax-{version}.dmg` - Disk image installer
- `parallax-darwin-x64-{version}.zip` - Portable

### Linux
- `parallax_{version}_amd64.deb` - Debian/Ubuntu package
- `parallax-{version}-1.x86_64.rpm` - RedHat/Fedora package
- `parallax-linux-x64-{version}.zip` - Portable

## 🎯 Key Features

✅ **localStorage → electron-store** - All data now stored securely and persistently
✅ **Cross-platform** - Builds for Windows, macOS, and Linux
✅ **Auto-updates ready** - Infrastructure in place for future updates
✅ **Single instance** - Only one app instance can run at a time
✅ **Security hardened** - Context isolation, sandbox mode, CSP

## 🔧 Useful Commands

| Command | What it does |
|---------|--------------|
| `npm run electron:dev` | Run app in development mode |
| `npm run build` | Build React app only |
| `npm run electron:package` | Package app (no installer) |
| `npm run electron:make` | Create installers for all platforms |
| `npm run clean` | Clean all build artifacts |

## 📁 File Structure

```
New Files Created:
├── electron/
│   ├── main.js              ← Main Electron process
│   └── preload.js           ← IPC bridge
├── forge.config.js          ← Packaging configuration
├── electron-types.d.ts      ← TypeScript definitions
├── ELECTRON_README.md       ← Full documentation
└── ELECTRON_QUICKSTART.md   ← This file

Modified Files:
├── package.json             ← Added Electron scripts & deps
├── vite.config.ts           ← Electron compatibility
├── components/NexusVault.tsx ← electron-store integration
└── .gitignore               ← Electron build artifacts
```

## ❓ Troubleshooting

**Blank window?**
- Wait 5-10 seconds for Vite to compile
- Check terminal for errors

**Port 3000 in use?**
```bash
# Kill the process and try again
npx kill-port 3000
npm run electron:dev
```

**Build fails?**
```bash
# Clean and reinstall
npm run clean
npm install
npm run build
```

## 📚 Need More Help?

See [ELECTRON_README.md](./ELECTRON_README.md) for comprehensive documentation.

---

**Happy building! 🎉**
