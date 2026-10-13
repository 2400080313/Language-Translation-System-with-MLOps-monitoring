import React from 'react';
import { MetricsBar } from '../components/MetricsBar';
import { TranslationCard } from '../components/TranslationCard';
import { InferenceHistory } from '../components/InferenceHistory';
import { TranslationRecord, MLOpsMetrics } from '../types';

interface WorkspacePageProps {
  metrics: MLOpsMetrics;
  currentRecord: TranslationRecord | null;
  history: TranslationRecord[];
  isLoading: boolean;
  onTranslate: (text: string, sourceLang: string, targetLang: string) => Promise<TranslationRecord | null>;
  onToggleFavorite: (id: string) => void;
  error?: string | null;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  metrics,
  currentRecord,
  history,
  isLoading,
  onTranslate,
  onToggleFavorite,
  error,
}) => {
  return (
    <div className="space-y-6">
      {/* Title & Pipeline Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Translation Workspace
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Neural machine translation across English, Hindi, Telugu, and Tamil with real-time MLOps metrics
        </p>
      </div>

      {/* Real-time MLOps telemetry snapshot */}
      <MetricsBar metrics={metrics} lastLatencyMs={currentRecord?.latencyMs} />

      {/* Translation card */}
      <TranslationCard
        onTranslate={onTranslate}
        isLoading={isLoading}
        currentRecord={currentRecord}
        onToggleFavorite={onToggleFavorite}
        error={error}
      />

      {/* Recent inference audit log */}
      <InferenceHistory records={history} />
    </div>
  );
};
