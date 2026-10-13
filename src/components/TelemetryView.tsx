import React from 'react';
import { Activity, ShieldCheck, Cpu, CheckCircle } from 'lucide-react';
import { MLOpsMetrics } from '../types';

interface TelemetryViewProps {
  metrics: MLOpsMetrics;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Inference Engine</h4>
              <p className="text-xs text-slate-400">HuggingFace MarianMT Transformer</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-700/50">
              <span className="text-slate-400">Model Version</span>
              <span className="font-mono text-slate-200">v2.4.1-prod</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-700/50">
              <span className="text-slate-400">Quantization</span>
              <span className="font-mono text-slate-200">INT8 ONNX Runtime</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Batch Size Limit</span>
              <span className="font-mono text-slate-200">32 requests</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Quality Monitoring</h4>
              <p className="text-xs text-slate-400">Automated BLEU / SacreBLEU checks</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-700/50">
              <span className="text-slate-400">Current BLEU</span>
              <span className="font-mono text-emerald-400">{metrics.bleuScore} / 100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-700/50">
              <span className="text-slate-400">Degradation Threshold</span>
              <span className="font-mono text-slate-200">&lt; 32.0 (Alert)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Confidence Avg</span>
              <span className="font-mono text-slate-200">96.4%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Drift Detection</h4>
              <p className="text-xs text-slate-400">EvidentlyAI / Kolmogorov-Smirnov</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-700/50">
              <span className="text-slate-400">Data Drift Status</span>
              <span className="font-mono text-emerald-400 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" /> No Drift
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-700/50">
              <span className="text-slate-400">Embedding Shift</span>
              <span className="font-mono text-slate-200">Δ 0.021 (Normal)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Last Baseline Check</span>
              <span className="font-mono text-slate-200">10 mins ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* MLOps Pipeline Flow */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-white mb-2">MLOps Architecture Lifecycle</h4>
        <p className="text-xs text-slate-400 mb-4">
          How this translation system is instrumented for continuous delivery and performance monitoring:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
            <div className="font-semibold text-indigo-300 mb-1">1. Ingestion</div>
            <p className="text-slate-400">Tokenized input stream with language tag detection.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
            <div className="font-semibold text-cyan-300 mb-1">2. Transformer NMT</div>
            <p className="text-slate-400">Sequence-to-sequence beam search inference.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
            <div className="font-semibold text-emerald-300 mb-1">3. MLOps Telemetry</div>
            <p className="text-slate-400">Prometheus latency recording & confidence metrics.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
            <div className="font-semibold text-amber-300 mb-1">4. Feedback & Retrain</div>
            <p className="text-slate-400">Evaluation on test sets to trigger continuous training.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
