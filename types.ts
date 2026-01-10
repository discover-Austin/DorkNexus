export interface DorkParams {
  site: string;
  inurl: string;
  intitle: string;
  intext: string;
  filetype: string;
  exclude: string;
  exact: string;
}

export interface DorkTemplate {
  name: string;
  description: string;
  query: string;
  category: 'files' | 'vulnerabilities' | 'network' | 'misc';
}

export interface AiDorkResponse {
  dork: string;
  explanation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface DorkAnalysis {
  rating: number; // 0-100
  critique: string[];
  optimizedDork: string;
  logicCheck: string;
  estimatedNoise: 'Low' | 'Medium' | 'High';
}

export interface EngineTranslation {
  engine: 'Shodan' | 'Censys' | 'Hunter' | 'ZoomEye';
  query: string;
  explanation: string;
}

export interface ResearchResult {
  content: string;
  sources: { title: string; uri: string }[];
}

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
}

export interface VaultItem {
  id: string;
  query: string;
  note: string;
  tags: string[];
  timestamp: number;
}

export enum Tab {
  BUILDER = 'builder',
  AI = 'ai',
  TEMPLATES = 'templates',
  PIVOT = 'pivot',
  RESEARCH = 'research',
  VISUALS = 'visuals',
  VAULT = 'vault',
  TERMINAL = 'terminal',
  SETTINGS = 'settings'
}

export interface AppSettings {
  // Theme Settings
  theme: {
    mode: 'dark' | 'light' | 'auto';
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: 'none' | 'small' | 'medium' | 'large';
    glassEffect: boolean;
  };

  // Font Settings
  font: {
    family: string;
    size: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    monoFamily: string;
    lineHeight: 'tight' | 'normal' | 'relaxed';
  };

  // Animation Settings
  animations: {
    enabled: boolean;
    speed: 'slow' | 'normal' | 'fast';
    reduceMotion: boolean;
    transitionDuration: number;
  };

  // Layout Settings
  layout: {
    compactMode: boolean;
    sidebarPosition: 'left' | 'top';
    showFooter: boolean;
    maxWidth: 'full' | '7xl' | '6xl' | '5xl';
  };

  // Notification Settings
  notifications: {
    enabled: boolean;
    sound: boolean;
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  };

  // Accessibility Settings
  accessibility: {
    highContrast: boolean;
    focusIndicator: boolean;
    screenReaderOptimized: boolean;
    keyboardShortcuts: boolean;
  };

  // Advanced Settings
  advanced: {
    devMode: boolean;
    autoSave: boolean;
    autoSaveInterval: number;
    maxHistoryItems: number;
    enableAnalytics: boolean;
  };
}