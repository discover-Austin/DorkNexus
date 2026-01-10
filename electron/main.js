const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize electron-store
const store = new Store({
  name: 'parallax-storage',
  encryptionKey: 'parallax-nexus-secure-key-2026'
});

let mainWindow;

// IPC Handlers for storage (replaces localStorage)
ipcMain.handle('store-get', (event, key) => {
  return store.get(key);
});

ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('store-delete', (event, key) => {
  store.delete(key);
  return true;
});

ipcMain.handle('store-clear', () => {
  store.clear();
  return true;
});

ipcMain.handle('store-has', (event, key) => {
  return store.has(key);
});

// Get all store data
ipcMain.handle('store-get-all', () => {
  return store.store;
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#0f172a',
    title: 'Parallax - Advanced Google Dorking Toolkit',
    icon: path.join(__dirname, '../build/icon.png'), // You can add an icon later
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    autoHideMenuBar: false,
    frame: true,
    show: false // Don't show until ready
  });

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    // Development mode - load from Vite dev server
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode - load from built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready to avoid flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links - open in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Handle navigation - allow only local files in production
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!process.env.VITE_DEV_SERVER_URL) {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'file:') {
        event.preventDefault();
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Security best practices
app.on('web-contents-created', (event, contents) => {
  // Disable navigation to untrusted origins
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    // Allow dev server in development
    if (process.env.VITE_DEV_SERVER_URL) {
      const devUrl = new URL(process.env.VITE_DEV_SERVER_URL);
      if (parsedUrl.origin === devUrl.origin) {
        return;
      }
    }

    // In production, only allow file protocol
    if (!process.env.VITE_DEV_SERVER_URL && parsedUrl.protocol === 'file:') {
      return;
    }

    event.preventDefault();
  });

  // Prevent new window creation except for external links
  contents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
});

// Handle app updates (optional - for future use)
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('app-name', () => {
  return app.getName();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  app.quit();
});

process.on('SIGINT', () => {
  app.quit();
});
