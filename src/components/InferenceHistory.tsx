import React from 'react';
import { History, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TranslationRecord } from '../types';

interface InferenceHistoryProps {
  records: TranslationRecord[];
}

export const InferenceHistory: React.FC<InferenceHistoryProps> = ({ records }) => {
  if (records.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Real-Time Inference Log (MLOps Monitored)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {records.length} recent events
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-700/80 text-slate-400 font-medium">
              <th className="pb-2 pl-2">Timestamp</th>
              <th className="pb-2">Direction</th>
              <th className="pb-2">Input Snippet</th>
              <th className="pb-2">Latency</th>
              <th className="pb-2">Confidence</th>
              <th className="pb-2 pr-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 pl-2 text-slate-400 font-mono">
                  {rec.timestamp}
                </td>
                <td className="py-2.5 font-mono">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    <span>{rec.sourceLang.toUpperCase()}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                    <span>{rec.targetLang.toUpperCase()}</span>
                  </span>
                </td>
                <td className="py-2.5 text-slate-300 max-w-xs truncate pr-3">
                  {rec.sourceText}
                </td>
                <td className="py-2.5 font-mono text-cyan-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-cyan-400/70" />
                    <span>{rec.latencyMs}ms</span>
                  </span>
                </td>
                <td className="py-2.5 font-mono text-slate-300">
                  {(rec.confidence * 100).toFixed(0)}%
                </td>
                <td className="py-2.5 pr-2 text-right">
                  <span className="inline-flex items-center space-x-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Success</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
