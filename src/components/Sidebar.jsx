import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Sliders,
  Play,
  Settings,
  PieChart,
  Scale,
  FileSpreadsheet,
  Info,
  ChevronRight,
  Sprout
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Crop Dataset', path: '/dataset', icon: Database },
  { name: 'Resource Constraints', path: '/constraints', icon: Sliders },
  { name: 'Run Optimization', path: '/optimize', icon: Play, highlight: true },
  { name: 'GA Configuration', path: '/ga-config', icon: Settings },
  { name: 'Optimization Results', path: '/results', icon: PieChart },
  { name: 'Algorithm Comparison', path: '/comparison', icon: Scale },
  { name: 'Analytics & Reports', path: '/analytics', icon: FileSpreadsheet },
  { name: 'About Project', path: '/about', icon: Info },
];

export default function Sidebar() {
  const { crops, latestResult } = useApp();

  return (
    <aside className="w-64 bg-white border-r border-surface-border flex flex-col justify-between min-h-[calc(100vh-4rem)] flex-shrink-0">
      <div className="p-4 space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Navigation Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : item.highlight
                      ? 'bg-accent-subtle text-primary hover:bg-accent-light'
                      : 'text-text-main hover:bg-surface-subtle hover:text-primary'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 stroke-[2]" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </div>

        {/* Quick Context Card */}
        <div className="bg-surface-bg border border-surface-border rounded-xl p-3.5 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-text-heading">
            <span className="flex items-center gap-1.5 text-primary">
              <Sprout className="w-3.5 h-3.5 text-accent" />
              Active Context
            </span>
            <span className="bg-accent-light text-primary px-1.5 py-0.5 rounded font-mono">
              {crops.length} Crops
            </span>
          </div>
          <div className="space-y-1 text-text-muted">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-text-main">
                {latestResult ? 'Plan Generated' : 'Ready'}
              </span>
            </div>
            {latestResult && (
              <div className="flex justify-between">
                <span>Best Profit:</span>
                <span className="font-semibold text-primary">
                  ₹{(latestResult.estimated_net_profit || 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer info in sidebar */}
      <div className="p-4 border-t border-surface-border text-[11px] text-text-muted text-center space-y-1">
        <p className="font-medium text-text-main">AgriOpt Decision Support</p>
        <p>Evolutionary Computing Project</p>
      </div>
    </aside>
  );
}
