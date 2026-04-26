import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings } from '../types';
import { setRuntimeApiKey } from '../utils/apiKeyCheck';

// Default settings
const defaultSettings: AppSettings = {
  apiKeys: {
    geminiApiKey: '',
  },
  theme: {
    mode: 'dark',
    accentColor: 'cyan',
    backgroundColor: '#0f172a',
    textColor: '#cbd5e1',
    borderRadius: 'medium',
    glassEffect: true,
  },
  font: {
    family: 'Inter, system-ui, sans-serif',
    size: 'base',
    monoFamily: 'Fira Code, monospace',
    lineHeight: 'normal',
  },
  animations: {
    enabled: true,
    speed: 'normal',
    reduceMotion: false,
    transitionDuration: 200,
  },
  layout: {
    compactMode: false,
    sidebarPosition: 'top',
    showFooter: true,
    maxWidth: '7xl',
  },
  notifications: {
    enabled: true,
    sound: false,
    position: 'top-right',
  },
  accessibility: {
    highContrast: false,
    focusIndicator: true,
    screenReaderOptimized: false,
    keyboardShortcuts: true,
  },
  advanced: {
    devMode: false,
    autoSave: true,
    autoSaveInterval: 30000,
    maxHistoryItems: 100,
    enableAnalytics: false,
  },
};

// Storage abstraction layer
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (window.electronStore) {
      const value = await window.electronStore.get(key);
      if (value !== undefined) {
        return JSON.stringify(value);
      }
    }

    return localStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (window.electronStore) {
      await window.electronStore.set(key, JSON.parse(value));
    } else {
      localStorage.setItem(key, value);
    }
  }
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await storage.getItem('app_settings');
        if (saved) {
          const parsedSettings = JSON.parse(saved);
          // Merge with defaults to ensure all keys exist
          const mergedSettings = { ...defaultSettings, ...parsedSettings };
          setRuntimeApiKey(mergedSettings.apiKeys.geminiApiKey);
          setSettings(mergedSettings);
        } else {
          setRuntimeApiKey(defaultSettings.apiKeys.geminiApiKey);
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    };
    loadSettings();
  }, []);

  // Apply CSS variables when settings change
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme colors
    root.style.setProperty('--bg-primary', settings.theme.backgroundColor);
    root.style.setProperty('--text-primary', settings.theme.textColor);

    // Apply font settings
    root.style.setProperty('--font-family', settings.font.family);
    root.style.setProperty('--font-mono', settings.font.monoFamily);

    // Apply animation duration
    const duration = settings.animations.transitionDuration;
    root.style.setProperty('--transition-duration', `${duration}ms`);

    // Apply border radius
    const radiusMap = {
      none: '0px',
      small: '0.25rem',
      medium: '0.5rem',
      large: '1rem',
    };
    root.style.setProperty('--border-radius', radiusMap[settings.theme.borderRadius]);

    // Apply reduce motion
    if (settings.animations.reduceMotion) {
      root.style.setProperty('--animation-duration', '0ms');
    } else {
      const speedMap = {
        slow: 300,
        normal: 200,
        fast: 100,
      };
      root.style.setProperty('--animation-duration', `${speedMap[settings.animations.speed]}ms`);
    }
  }, [settings]);

  const updateSettings = async (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings };

    // Deep merge updates
    Object.keys(updates).forEach((key) => {
      const updateKey = key as keyof AppSettings;
      if (typeof updates[updateKey] === 'object' && !Array.isArray(updates[updateKey])) {
        newSettings[updateKey] = { ...newSettings[updateKey], ...updates[updateKey] } as any;
      } else {
        newSettings[updateKey] = updates[updateKey] as any;
      }
    });

    setRuntimeApiKey(newSettings.apiKeys.geminiApiKey);
    setSettings(newSettings);
    await storage.setItem('app_settings', JSON.stringify(newSettings));
  };

  const resetSettings = async () => {
    setRuntimeApiKey(defaultSettings.apiKeys.geminiApiKey);
    setSettings(defaultSettings);
    await storage.setItem('app_settings', JSON.stringify(defaultSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
