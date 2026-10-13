import React, { useState } from 'react';
import { User as UserIcon, Shield, Key, Copy, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, token, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [copiedToken, setCopiedToken] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    updateProfile(fullName.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
          <UserIcon className="w-7 h-7 text-indigo-400" />
          <span>Profile & Account Settings</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal details, access credentials, and review your role permissions
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'user@translateml.edu'}
              className="w-full bg-slate-900/70 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Account identifier mapped to PostgreSQL authentication records
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Assigned Role
            </label>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>{user?.role || 'user'}</span>
              </span>
              <span className="text-xs text-slate-400">
                {user?.role === 'admin'
                  ? 'Full administrative control (User management, model registry, audit logs)'
                  : 'Standard translation workspace access'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-medium">
                Profile updated successfully!
              </span>
            )}
          </div>
        </form>

        {/* API Credentials */}
        <div className="border-t border-slate-700/60 pt-5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Bearer Token</span>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="password"
              readOnly
              value={token || 'demo-jwt-token-active'}
              className="flex-1 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs font-mono text-slate-400"
            />
            <button
              type="button"
              onClick={copyToken}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              {copiedToken ? (
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
          <p className="text-[11px] text-slate-500 mt-1">
            Used to authenticate API requests against FastAPI endpoints (<code className="text-slate-400">Authorization: Bearer &lt;token&gt;</code>)
          </p>
        </div>
      </div>
    </div>
  );
};
