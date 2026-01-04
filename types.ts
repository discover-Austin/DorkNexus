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
  TERMINAL = 'terminal'
}