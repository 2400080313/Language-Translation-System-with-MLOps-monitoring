export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  translationsCount?: number;
}

export interface TranslationRecord {
  id: string;
  userId?: string;
  timestamp: string;
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  translatedText: string;
  latencyMs: number;
  tokenCount: number;
  confidence: number;
  isFavorite?: boolean;
  modelName?: string;
  modelVersion?: string;
  bleuScore?: number;
  chrFScore?: number;
}

export interface MLOpsMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  bleuScore: number;
  chrFScore: number;
  dataDriftDetected: boolean;
  driftPValue: number;
  activeModel: string;
  modelVersion: string;
  status: 'healthy' | 'degraded' | 'offline';
  throughputQps: number;
}

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  framework: string;
  supportedLanguages: string[];
  bleuBenchmark: number;
  chrFBenchmark: number;
  isActive: boolean;
  deployedAt: string;
  inferenceEngine: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  resource: string;
  details: string;
  ipAddress?: string;
}

export interface DriftReport {
  timestamp: string;
  baselineTokens: number;
  currentTokens: number;
  ksStatistic: number;
  pValue: number;
  isDrift: boolean;
  featuresDrifted: string[];
}
