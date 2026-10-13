import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Star,
  Trash2,
  Copy,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';
import { TranslationRecord } from '../types';

interface HistoryPageProps {
  records: TranslationRecord[];
  onToggleFavorite: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  records,
  onToggleFavorite,
  onDeleteRecord,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPair, setFilterPair] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchSearch =
        rec.sourceText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.translatedText.toLowerCase().includes(searchTerm.toLowerCase());
      const pair = `${rec.sourceLang}-${rec.targetLang}`;
      const matchPair = filterPair === 'all' || pair === filterPair;
      return matchSearch && matchPair;
    });
  }, [records, searchTerm, filterPair]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <History className="w-7 h-7 text-indigo-400" />
            <span>Translation History</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review past model inferences, latencies, and save favorite translations
          </p>
        </div>
        {records.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your translation history?')) {
                onClearHistory();
              }
            }}
            className="self-start sm:self-auto text-xs px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search within past translations..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full sm:w-auto">
          <select
            value={filterPair}
            onChange={(e) => {
              setFilterPair(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Language Pairs</option>
            <option value="en-hi">English → Hindi</option>
            <option value="hi-en">Hindi → English</option>
            <option value="en-te">English → Telugu</option>
            <option value="te-en">Telugu → English</option>
            <option value="en-ta">English → Tamil</option>
            <option value="ta-en">Tamil → English</option>
          </select>
        </div>
      </div>

      {/* Record list */}
      {filteredRecords.length === 0 ? (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center text-slate-400">
          <History className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <p className="text-base font-medium text-slate-300">No translation records found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || filterPair !== 'all'
              ? 'Try modifying your search query or language filter.'
              : 'Translate some sentences in the workspace to see them logged here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 rounded-xl p-4 transition-all shadow-md backdrop-blur-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5 mb-3 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-slate-400">{rec.timestamp}</span>
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-700 font-mono text-[11px]">
                    <span>{rec.sourceLang.toUpperCase()}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-indigo-400" />
                    <span>{rec.targetLang.toUpperCase()}</span>
                  </span>
                  <span className="text-cyan-400 font-mono flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{rec.latencyMs}ms</span>
                  </span>
                  {rec.bleuScore && (
                    <span className="text-indigo-300 hidden sm:inline">
                      BLEU: {rec.bleuScore}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onToggleFavorite(rec.id)}
                    title={rec.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      rec.isFavorite
                        ? 'text-amber-400 hover:bg-amber-400/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${rec.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleCopy(rec.id, rec.translatedText)}
                    title="Copy translation"
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {copiedId === rec.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteRecord(rec.id)}
                    title="Delete record"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Source ({rec.sourceLang.toUpperCase()})
                  </div>
                  <div className="text-slate-200">{rec.sourceText}</div>
                </div>
                <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-900/30">
                  <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1">
                    Translated ({rec.targetLang.toUpperCase()})
                  </div>
                  <div className="text-white font-medium">{rec.translatedText}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, filteredRecords.length)} of{' '}
              {filteredRecords.length} records
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
              >
                Previous
              </button>
              <span className="font-mono text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
