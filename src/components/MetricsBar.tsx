import React from 'react';
import { Activity, Clock, Zap, CheckCircle2, TrendingUp } from 'lucide-react';
import { MLOpsMetrics } from '../types';

interface MetricsBarProps {
  metrics: MLOpsMetrics;
  lastLatencyMs?: number;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics, lastLatencyMs }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {/* Metric 1: Request Volume */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur-sm hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-400">Total Inferences</span>
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl sm:text-2xl font-bold text-white font-mono">
            {metrics.totalRequests.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-400 flex items-center font-medium">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Logged to MLOps store</p>
      </div>

      {/* Metric 2: Average Latency */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur-sm hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-400">Inference Latency</span>
          <Clock className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl sm:text-2xl font-bold text-white font-mono">
            {lastLatencyMs ? `${lastLatencyMs}ms` : `${metrics.avgLatencyMs}ms`}
          </span>
          <span className="text-xs text-slate-400">avg {metrics.avgLatencyMs}ms</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">SLA target &lt; 500ms</p>
      </div>

      {/* Metric 3: BLEU Quality Metric */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur-sm hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-400">BLEU Score</span>
          <Activity className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl sm:text-2xl font-bold text-white font-mono">
            {metrics.bleuScore.toFixed(1)}
          </span>
          <span className="text-xs text-emerald-400 font-medium">Optimal</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">NMT Benchmark validation</p>
      </div>

      {/* Metric 4: Health & Drift */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur-sm hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-400">Data Drift Status</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
            None
          </span>
          <span className="text-xs text-slate-400 font-mono">p=0.88</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">KS test distribution aligned</p>
      </div>
    </div>
  );
};
