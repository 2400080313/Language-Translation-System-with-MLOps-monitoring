import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Cpu,
  RotateCcw,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Settings
} from 'lucide-react';
import { User, ModelMetadata, AuditLog } from '../types';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'models' | 'audit' | 'settings'>('users');
  const [userSearch, setUserSearch] = useState('');

  // Sample users list with state toggle
  const [users, setUsers] = useState<User[]>([
    {
      id: 'usr-1',
      email: 'admin@translateml.edu',
      fullName: 'Prof. Translation Admin',
      role: 'admin',
      isActive: true,
      createdAt: '2026-10-10',
      translationsCount: 142,
    },
    {
      id: 'usr-2',
      email: 'researcher.indic@univ.edu',
      fullName: 'Dr. Ramesh Kumar',
      role: 'user',
      isActive: true,
      createdAt: '2026-10-11',
      translationsCount: 88,
    },
    {
      id: 'usr-3',
      email: 'student.ml@campus.edu',
      fullName: 'Ananya Sharma',
      role: 'user',
      isActive: true,
      createdAt: '2026-10-12',
      translationsCount: 35,
    },
    {
      id: 'usr-4',
      email: 'external.eval@nlp-lab.org',
      fullName: 'Karthik Raja',
      role: 'user',
      isActive: false,
      createdAt: '2026-10-09',
      translationsCount: 12,
    },
  ]);

  // Model checkpoints with active state & rollback support
  const [models, setModels] = useState<ModelMetadata[]>([
    {
      id: 'mod-1',
      name: 'M2M100-Indic-v2.1',
      version: 'v2.1',
      framework: 'PyTorch / Transformers',
      supportedLanguages: ['en', 'hi', 'te', 'ta', 'es', 'fr', 'de'],
      bleuBenchmark: 38.6,
      chrFBenchmark: 61.2,
      isActive: true,
      deployedAt: '2026-10-12 14:00',
      inferenceEngine: 'ONNX Runtime INT8',
    },
    {
      id: 'mod-2',
      name: 'MarianMT-Indic-v1.5',
      version: 'v1.5',
      framework: 'PyTorch / Marian',
      supportedLanguages: ['en', 'hi', 'te', 'ta'],
      bleuBenchmark: 35.8,
      chrFBenchmark: 56.4,
      isActive: false,
      deployedAt: '2026-10-05 09:30',
      inferenceEngine: 'TorchScript',
    },
    {
      id: 'mod-3',
      name: 'IndicTrans2-1B-Experimental',
      version: 'v3.0-rc',
      framework: 'PyTorch / IndicTrans',
      supportedLanguages: ['en', 'hi', 'te', 'ta'],
      bleuBenchmark: 41.2,
      chrFBenchmark: 64.8,
      isActive: false,
      deployedAt: '2026-10-13 18:00',
      inferenceEngine: 'vLLM Service',
    },
  ]);

  // Audit Logs
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: 'aud-1',
      timestamp: '2026-10-13 22:20:10',
      userEmail: 'admin@translateml.edu',
      action: 'MODEL_EVALUATION',
      resource: 'M2M100-Indic-v2.1',
      details: 'Automated test suite ran: BLEU 38.6, chrF 61.2 verified.',
    },
    {
      id: 'aud-2',
      timestamp: '2026-10-13 21:45:00',
      userEmail: 'admin@translateml.edu',
      action: 'RATE_LIMIT_UPDATE',
      resource: 'API Gateway',
      details: 'Default rate limit set to 60 requests/minute per authenticated user.',
    },
    {
      id: 'aud-3',
      timestamp: '2026-10-13 19:30:15',
      userEmail: 'admin@translateml.edu',
      action: 'USER_ROLE_CHANGE',
      resource: 'usr-2 (researcher.indic@univ.edu)',
      details: 'Updated quota tier to Academic Researcher.',
    },
  ]);

  const toggleUserActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const toggleUserRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
      )
    );
  };

  const handlePromoteOrRollback = (modelId: string) => {
    const target = models.find((m) => m.id === modelId);
    if (!target) return;

    if (
      window.confirm(
        `Are you sure you want to switch the active production model to ${target.name} (${target.version})?`
      )
    ) {
      setModels((prev) =>
        prev.map((m) => ({
          ...m,
          isActive: m.id === modelId,
        }))
      );
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.fullName.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
          <ShieldAlert className="w-7 h-7 text-indigo-400" />
          <span>Admin Control Console</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage system users, model deployments, rollbacks, rate limiting, and security audit logs
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management</span>
        </button>

        <button
          onClick={() => setActiveTab('models')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'models'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Model Registry & Promotion</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit & Security Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Rate Limits & Config</span>
        </button>
      </div>

      {/* Tab Content 1: Users */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-400">{filteredUsers.length} total accounts</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-medium">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Inferences</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-semibold text-white">{u.fullName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.isActive ? (
                        <span className="inline-flex items-center text-emerald-400 space-x-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-400 space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-300">{u.translationsCount || 0}</td>
                    <td className="p-3 text-slate-400 font-mono">{u.createdAt}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => toggleUserRole(u.id)}
                        className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      >
                        Make {u.role === 'admin' ? 'User' : 'Admin'}
                      </button>
                      <button
                        onClick={() => toggleUserActive(u.id)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          u.isActive
                            ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Model Registry & Rollback */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl text-xs text-slate-400">
            <span className="font-semibold text-white">Controlled Model Promotion & Rollback: </span>
            You can dynamically switch the active production model. The inference router updates immediately without server restarts.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((mod) => (
              <div
                key={mod.id}
                className={`p-5 rounded-2xl border transition-all ${
                  mod.isActive
                    ? 'bg-indigo-950/20 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-800/50 border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    {mod.version}
                  </span>
                  {mod.isActive ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>ACTIVE IN PRODUCTION</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">Standby Checkpoint</span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base mb-1">{mod.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{mod.framework} • {mod.inferenceEngine}</p>

                <div className="space-y-2 text-xs border-t border-slate-700/60 pt-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">BLEU Benchmark:</span>
                    <span className="font-mono text-emerald-400 font-bold">{mod.bleuBenchmark}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">chrF Benchmark:</span>
                    <span className="font-mono text-cyan-400 font-bold">{mod.chrFBenchmark}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Supported Languages:</span>
                    <span className="font-mono text-slate-300">{mod.supportedLanguages.join(', ').toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deployed At:</span>
                    <span className="font-mono text-slate-400">{mod.deployedAt}</span>
                  </div>
                </div>

                {!mod.isActive ? (
                  <button
                    onClick={() => handlePromoteOrRollback(mod.id)}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Promote / Rollback to This Model</span>
                  </button>
                ) : (
                  <div className="w-full py-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
                    Serving Traffic
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-medium">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target Resource</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="p-3 text-slate-200 font-mono">{log.userEmail}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 font-semibold">{log.resource}</td>
                  <td className="p-3 text-slate-400">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 4: Settings & Rate Limits */}
      {activeTab === 'settings' && (
        <div className="max-w-xl bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">System Rate Limits & Quotas</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">Standard User Limit (Requests/minute)</label>
              <input
                type="number"
                defaultValue={60}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Max Input Character Length</label>
              <input
                type="number"
                defaultValue={5000}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Prometheus Metric Scraping Interval (Seconds)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <button
              onClick={() => alert('Configuration updated successfully.')}
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
