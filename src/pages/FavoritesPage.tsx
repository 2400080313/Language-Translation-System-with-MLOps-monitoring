import React, { useState } from 'react';
import { Star, Copy, Check, ArrowRight, Trash2 } from 'lucide-react';
import { TranslationRecord } from '../types';

interface FavoritesPageProps {
  favorites: TranslationRecord[];
  onToggleFavorite: (id: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  onToggleFavorite,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
          <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
          <span>Favorite Translations</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Quickly access and copy bookmarked translations and benchmark references
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center text-slate-400">
          <Star className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <p className="text-base font-medium text-slate-300">No favorite translations saved yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Click the star icon on any translation in the workspace or history to bookmark it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-800/60 border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-5 transition-all shadow-md backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-700 font-mono text-[11px]">
                      <span>{rec.sourceLang.toUpperCase()}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                      <span>{rec.targetLang.toUpperCase()}</span>
                    </span>
                    <span className="text-slate-400 font-mono">{rec.timestamp}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCopy(rec.id, rec.translatedText)}
                      title="Copy translated text"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {copiedId === rec.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onToggleFavorite(rec.id)}
                      title="Remove from favorites"
                      className="p-1.5 text-amber-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Original
                    </span>
                    <p className="text-slate-300 text-sm mt-0.5">{rec.sourceText}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      Translation
                    </span>
                    <p className="text-white font-medium text-sm mt-0.5">
                      {rec.translatedText}
                    </p>
                  </div>
                </div>
              </div>

              {rec.bleuScore && (
                <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>BLEU: <strong className="text-emerald-400">{rec.bleuScore}</strong></span>
                  <span>Latency: {rec.latencyMs}ms</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
