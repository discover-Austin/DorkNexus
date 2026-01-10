/**
 * TypeScript definitions for Electron APIs exposed via preload script
 * This file provides type safety for Electron IPC communication
 */

interface ElectronStore {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<boolean>;
  delete: (key: string) => Promise<boolean>;
  clear: () => Promise<boolean>;
  has: (key: string) => Promise<boolean>;
  getAll: () => Promise<any>;
}

interface ElectronApp {
  version: () => Promise<string>;
  name: () => Promise<string>;
  platform: string;
  isElectron: boolean;
}

interface Storage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  key: (index: number) => Promise<string | null>;
  readonly length: Promise<number>;
}

interface ElectronConsole {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
}

interface Env {
  isDevelopment: boolean;
  isProduction: boolean;
}

declare global {
  interface Window {
    electronStore: ElectronStore;
    electronApp: ElectronApp;
    storage: Storage;
    electronConsole: ElectronConsole;
    env: Env;
  }
}

export {};
