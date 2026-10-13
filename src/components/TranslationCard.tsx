import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Loader2,
  Clock,
  Gauge,
  Volume2,
  Star,
  AlertTriangle
} from 'lucide-react';
import { Language, TranslationRecord } from '../types';
import { SUPPORTED_LANGUAGES, SAMPLE_PHRASES, isLanguagePairSupported } from '../data/languages';

interface TranslationCardProps {
  onTranslate: (
    text: string,
    sourceLang: string,
    targetLang: string
  ) => Promise<TranslationRecord | null>;
  isLoading: boolean;
  currentRecord: TranslationRecord | null;
  onToggleFavorite?: (recordId: string) => void;
  error?: string | null;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({
  onTranslate,
  isLoading,
  currentRecord,
  onToggleFavorite,
  error: externalError,
}) => {
  const [sourceLang, setSourceLang] = useState<string>('en');
  const [targetLang, setTargetLang] = useState<string>('hi');
  const [inputText, setInputText] = useState<string>(
    'Machine learning models require continuous monitoring in production.'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [pairError, setPairError] = useState<string | null>(null);

  // Validate on change
  const handleSourceChange = (val: string) => {
    setSourceLang(val);
    const check = isLanguagePairSupported(val, targetLang);
    setPairError(check.supported ? null : check.reason || 'Unsupported pair');
  };

  const handleTargetChange = (val: string) => {
    setTargetLang(val);
    const check = isLanguagePairSupported(sourceLang, val);
    setPairError(check.supported ? null : check.reason || 'Unsupported pair');
  };

  const handleSwapLanguages = () => {
    const newSource = targetLang;
    const newTarget = sourceLang;
    setSourceLang(newSource);
    setTargetLang(newTarget);
    const check = isLanguagePairSupported(newSource, newTarget);
    setPairError(check.supported ? null : check.reason || 'Unsupported pair');

    if (currentRecord?.translatedText) {
      setInputText(currentRecord.translatedText);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const check = isLanguagePairSupported(sourceLang, targetLang);
    if (!check.supported) {
      setPairError(check.reason || 'Unsupported language pair');
      return;
    }
    setPairError(null);
    onTranslate(inputText, sourceLang, targetLang);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleCopy = () => {
    if (!currentRecord?.translatedText) return;
    navigator.clipboard.writeText(currentRecord.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!currentRecord?.translatedText || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentRecord.translatedText);
    utterance.lang = currentRecord.targetLang;
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    setInputText('');
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden mb-8">
      {/* Language Selector Header */}
      <div className="border-b border-slate-700/80 bg-slate-900/40 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Source Language Selector */}
        <div className="flex-1 flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[50px]">
            From
          </label>
          <div className="relative flex-1">
            <select
              value={sourceLang}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang: Language) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={handleSwapLanguages}
            aria-label="Swap languages"
            title="Swap source and target languages"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500/50 transition-all shadow-sm active:scale-95 group"
          >
            <ArrowLeftRight className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
          </button>
        </div>

        {/* Target Language Selector */}
        <div className="flex-1 flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[50px]">
            To
          </label>
          <div className="relative flex-1">
            <select
              value={targetLang}
              onChange={(e) => handleTargetChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang: Language) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Language pair warning alert if invalid */}
      {(pairError || externalError) && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Validation Notice: </span>
            <span>{pairError || externalError}</span>
          </div>
        </div>
      )}

      {/* Main Panels: Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-700/80">
        {/* Source Text Area Section */}
        <div className="p-5 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">
                Enter source text
              </span>
              {inputText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or paste your text here to translate..."
              rows={8}
              className="w-full bg-transparent resize-none border-0 text-slate-100 placeholder-slate-500 focus:ring-0 focus:outline-none text-base sm:text-lg leading-relaxed selection:bg-indigo-500/30"
            />
          </div>

          <div>
            {/* Quick Sample Prompts */}
            <div className="pt-3 border-t border-slate-700/40">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Sample inputs:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PHRASES.slice(0, 3).map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(phrase)}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-left truncate max-w-[280px]"
                    title={phrase}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Footer: Counts & Action */}
            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-mono">
                <span>{charCount} chars</span>
                <span className="mx-2">•</span>
                <span>{wordCount} words</span>
                <span className="mx-2 hidden sm:inline">•</span>
                <span className="text-slate-500 hidden sm:inline">Ctrl + Enter to run</span>
              </div>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!inputText.trim() || isLoading || !!pairError}
                className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg ${
                  !inputText.trim() || isLoading || !!pairError
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white shadow-indigo-500/25 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Translate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Target Translation Output Section */}
        <div className="p-5 flex flex-col justify-between min-h-[300px] bg-slate-900/30">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">
                Translation output
              </span>
              {currentRecord?.translatedText && (
                <div className="flex items-center space-x-2">
                  {onToggleFavorite && (
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(currentRecord.id)}
                      title="Save to favorites"
                      className={`text-xs px-2.5 py-1 rounded-md border flex items-center space-x-1.5 transition-colors ${
                        currentRecord.isFavorite
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          currentRecord.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                      <span className="hidden sm:inline">
                        {currentRecord.isFavorite ? 'Saved' : 'Favorite'}
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSpeak}
                    title="Listen to pronunciation"
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center space-x-1.5 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Listen</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center space-x-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                <p className="text-sm">Running model inference pipeline...</p>
              </div>
            ) : currentRecord?.translatedText ? (
              <div className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal min-h-[160px] whitespace-pre-wrap select-text">
                {currentRecord.translatedText}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-slate-500 text-sm">
                <p>Click "Translate" to generate inference output.</p>
              </div>
            )}
          </div>

          {/* Translation Telemetry Footer */}
          {currentRecord && !isLoading && (
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-4 text-slate-400 font-mono">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Latency: <strong className="text-slate-200">{currentRecord.latencyMs}ms</strong></span>
                </span>
                <span className="flex items-center space-x-1">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confidence: <strong className="text-slate-200">{(currentRecord.confidence * 100).toFixed(0)}%</strong></span>
                </span>
                {currentRecord.bleuScore && (
                  <span className="text-indigo-400 font-medium">
                    BLEU: {currentRecord.bleuScore}
                  </span>
                )}
                {currentRecord.chrFScore && (
                  <span className="text-cyan-400 font-medium">
                    chrF: {currentRecord.chrFScore}
                  </span>
                )}
                <span className="hidden sm:inline text-slate-500">
                  {currentRecord.tokenCount} tokens
                </span>
              </div>

              <div className="flex items-center space-x-1.5 text-indigo-400 font-medium">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>MLOps Monitored</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
