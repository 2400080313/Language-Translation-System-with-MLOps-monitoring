import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Languages,
  History,
  Star,
  Activity,
  ShieldAlert,
  User as UserIcon,
  LogOut,
  Cpu,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Translation', icon: Languages },
    { to: '/history', label: 'History', icon: History },
    { to: '/favorites', label: 'Favorites', icon: Star },
    { to: '/analytics', label: 'MLOps Metrics', icon: Activity },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Console', icon: ShieldAlert }] : []),
    { to: '/profile', label: 'Profile & Settings', icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 p-0.5">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="font-bold text-white text-base leading-tight">TranslateML</div>
              <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold">
                MLOps Monitored
              </div>
            </div>
          </div>

          {/* Model info banner */}
          <div className="mx-4 my-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center space-x-2 text-slate-300 font-medium mb-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Active Model</span>
            </div>
            <div className="text-white font-mono text-[11px] font-semibold truncate">
              M2M100-Indic-v2.1
            </div>
            <div className="mt-1 flex items-center space-x-1.5 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Inference Pipeline Live</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-inner'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.fullName || 'User'}
                </div>
                <div className="text-[10px] text-slate-400 capitalize">
                  {user?.role || 'Guest'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-slate-500 text-center">
            Language Translation System v1.0
          </div>
        </div>
      </aside>
    </>
  );
};
