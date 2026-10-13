import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WorkspacePage } from './pages/WorkspacePage';
import { HistoryPage } from './pages/HistoryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { TranslationRecord, MLOpsMetrics } from './types';
import { simulateTranslation } from './utils/mockTranslate';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active translation record
  const [currentRecord, setCurrentRecord] = useState<TranslationRecord | null>({
    id: 'rec-init-1',
    timestamp: '22:30:15',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Machine learning models require continuous monitoring in production.',
    translatedText: 'मशीन लर्निंग मॉडल को उत्पादन में निरंतर निगरानी की आवश्यकता होती है।',
    latencyMs: 168,
    tokenCount: 18,
    confidence: 0.98,
    bleuScore: 39.2,
    chrFScore: 61.4,
    isFavorite: true,
  });

  // Translation history list
  const [history, setHistory] = useState<TranslationRecord[]>([
    {
      id: 'rec-0',
      timestamp: '22:30:15',
      sourceLang: 'en',
      targetLang: 'hi',
      sourceText: 'Machine learning models require continuous monitoring in production.',
      translatedText: 'मशीन लर्निंग मॉडल को उत्पादन में निरंतर निगरानी की आवश्यकता होती है।',
      latencyMs: 168,
      tokenCount: 18,
      confidence: 0.98,
      bleuScore: 39.2,
      chrFScore: 61.4,
      isFavorite: true,
    },
    {
      id: 'rec-1',
      timestamp: '22:25:12',
      sourceLang: 'en',
      targetLang: 'te',
      sourceText: 'The MLOps pipeline monitors latency, drift, and translation quality.',
      translatedText: 'MLOps పైప్‌లైన్ జాప్యం, డ్రిఫ్ట్ మరియు అనువాద నాణ్యతను పర్యవేక్షిస్తుంది.',
      latencyMs: 194,
      tokenCount: 16,
      confidence: 0.96,
      bleuScore: 36.8,
      chrFScore: 58.5,
      isFavorite: true,
    },
    {
      id: 'rec-2',
      timestamp: '22:20:04',
      sourceLang: 'en',
      targetLang: 'ta',
      sourceText: 'Hello, how can I help you with your translation today?',
      translatedText: 'வணக்கம், இன்று உங்கள் மொழிபெயர்ப்பில் நான் எவ்வாறு உதவ முடியும்?',
      latencyMs: 182,
      tokenCount: 14,
      confidence: 0.97,
      bleuScore: 37.4,
      chrFScore: 59.1,
      isFavorite: false,
    },
  ]);

  // Telemetry metrics
  const [metrics, setMetrics] = useState<MLOpsMetrics>({
    totalRequests: 1428,
    successfulRequests: 1425,
    failedRequests: 3,
    avgLatencyMs: 174,
    p95LatencyMs: 228,
    bleuScore: 38.6,
    chrFScore: 61.2,
    dataDriftDetected: false,
    driftPValue: 0.884,
    activeModel: 'M2M100-Indic-v2.1',
    modelVersion: 'v2.1',
    status: 'healthy',
    throughputQps: 18.4,
  });

  const handleTranslate = async (
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationRecord | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await simulateTranslation(text, sourceLang, targetLang);
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const newRecord: TranslationRecord = {
        id: `rec-${Date.now()}`,
        timestamp: timeStr,
        sourceLang,
        targetLang,
        sourceText: text,
        translatedText: result.translatedText,
        latencyMs: result.latencyMs,
        tokenCount: result.tokenCount,
        confidence: result.confidence,
        bleuScore: result.bleuScore,
        chrFScore: result.chrFScore,
        isFavorite: false,
      };

      setCurrentRecord(newRecord);
      setHistory((prev) => [newRecord, ...prev]);

      // Update MLOps telemetry metrics
      setMetrics((prev) => {
        const total = prev.totalRequests + 1;
        const avg = Math.round((prev.avgLatencyMs * 9 + result.latencyMs) / 10);
        return {
          ...prev,
          totalRequests: total,
          successfulRequests: prev.successfulRequests + 1,
          avgLatencyMs: avg,
        };
      });

      return newRecord;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Translation failed';
      setError(msg);
      setMetrics((prev) => ({
        ...prev,
        totalRequests: prev.totalRequests + 1,
        failedRequests: prev.failedRequests + 1,
      }));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
    if (currentRecord?.id === id) {
      setCurrentRecord((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleDeleteRecord = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
    if (currentRecord?.id === id) {
      setCurrentRecord(null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentRecord(null);
  };

  const favorites = history.filter((r) => r.isFavorite);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            <Route
              path="/"
              element={
                <WorkspacePage
                  metrics={metrics}
                  currentRecord={currentRecord}
                  history={history}
                  isLoading={isLoading}
                  onTranslate={handleTranslate}
                  onToggleFavorite={handleToggleFavorite}
                  error={error}
                />
              }
            />
            <Route
              path="/history"
              element={
                <HistoryPage
                  records={history}
                  onToggleFavorite={handleToggleFavorite}
                  onDeleteRecord={handleDeleteRecord}
                  onClearHistory={handleClearHistory}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <FavoritesPage
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              }
            />
            <Route
              path="/analytics"
              element={<AnalyticsPage metrics={metrics} />}
            />
            <Route
              path="/admin"
              element={<AdminPage />}
            />
            <Route
              path="/profile"
              element={<ProfilePage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-800/80 bg-slate-900/50 py-3 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
            <span>Language Translation System with MLOps Monitoring</span>
            <span className="font-mono text-slate-400">React • TypeScript • Vite • Tailwind • Recharts</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/*" element={<DashboardLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
