const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload script for Parallax
 * Exposes secure IPC methods to the renderer process
 * Replaces localStorage with electron-store
 */

// Expose storage API to renderer process
contextBridge.exposeInMainWorld('electronStore', {
  // Get a value from store
  get: (key) => ipcRenderer.invoke('store-get', key),

  // Set a value in store
  set: (key, value) => ipcRenderer.invoke('store-set', key, value),

  // Delete a value from store
  delete: (key) => ipcRenderer.invoke('store-delete', key),

  // Clear all store data
  clear: () => ipcRenderer.invoke('store-clear'),

  // Check if key exists
  has: (key) => ipcRenderer.invoke('store-has', key),

  // Get all store data
  getAll: () => ipcRenderer.invoke('store-get-all')
});

// Expose app info API
contextBridge.exposeInMainWorld('electronApp', {
  version: () => ipcRenderer.invoke('app-version'),
  name: () => ipcRenderer.invoke('app-name'),
  platform: process.platform,
  isElectron: true
});

// Storage API that mimics localStorage for easy migration
contextBridge.exposeInMainWorld('storage', {
  // Synchronous-like API using promises (but needs to be used with await/then)
  getItem: async (key) => {
    const value = await ipcRenderer.invoke('store-get', key);
    return value !== undefined ? value : null;
  },

  setItem: async (key, value) => {
    await ipcRenderer.invoke('store-set', key, value);
  },

  removeItem: async (key) => {
    await ipcRenderer.invoke('store-delete', key);
  },

  clear: async () => {
    await ipcRenderer.invoke('store-clear');
  },

  // Additional helper method
  key: async (index) => {
    const allData = await ipcRenderer.invoke('store-get-all');
    const keys = Object.keys(allData);
    return keys[index] || null;
  },

  get length() {
    // Note: This needs to be async in Electron context
    return ipcRenderer.invoke('store-get-all').then(data => Object.keys(data).length);
  }
});

// Expose a safer console for debugging (optional)
contextBridge.exposeInMainWorld('electronConsole', {
  log: (...args) => console.log('[Renderer]', ...args),
  error: (...args) => console.error('[Renderer]', ...args),
  warn: (...args) => console.warn('[Renderer]', ...args),
  info: (...args) => console.info('[Renderer]', ...args)
});

// Security: Log when preload script is loaded
console.log('Parallax preload script loaded successfully');

// Expose environment info
contextBridge.exposeInMainWorld('env', {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
});
