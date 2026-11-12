import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Clock,
  TrendingUp,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getReportCsvUrl, getReportPdfUrl, fetchOptimizationById } from '../services/api';
import ConvergenceChart from '../charts/ConvergenceChart';

export default function AnalyticsPage() {
  const { history, setLatestResult } = useApp();
  const [selectedRun, setSelectedRun] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [search, setSearch] = useState('');

  const handleInspectRun = async (id) => {
    setLoadingDetail(true);
    try {
      const data = await fetchOptimizationById(id);
      if (data && data.result) {
        setSelectedRun(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const filteredHistory = history.filter((h) => {
    const q = search.toLowerCase();
    return (
      h.id.toLowerCase().includes(q) ||
      h.algorithm.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Analytics & Historical Reports
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Audit past optimization experiments, inspect evolutionary convergence runs, and generate formal PDF reports.
          </p>
        </div>
      </div>

      {/* History Table Card */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-text-heading">Optimization Run Log</h3>
            <p className="text-xs text-text-muted">History of simulations executed in this environment</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by run ID or algorithm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-surface-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted bg-surface-subtle/50 rounded-xl">
            No optimization records found. Run an optimization from the workspace to populate historical analytics.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle text-text-heading font-semibold border-b border-surface-border">
                <tr>
                  <th className="py-2.5 px-3">Run ID</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Algorithm</th>
                  <th className="py-2.5 px-3 text-right">Crops</th>
                  <th className="py-2.5 px-3 text-right">Estimated Net Profit</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Reports</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-text-main">
                      {entry.id.slice(0, 8)}
                    </td>
                    <td className="py-2.5 px-3 text-text-muted">
                      {new Date(entry.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-text-heading">
                      {entry.algorithm}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">{entry.n_crops}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-primary">
                      ₹{(entry.estimated_net_profit || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Feasible
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleInspectRun(entry.id)}
                          className="p-1 rounded hover:bg-surface-subtle text-text-muted hover:text-primary transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={getReportCsvUrl(entry.id)}
                          download
                          className="p-1 rounded hover:bg-surface-subtle text-text-muted hover:text-emerald-700 transition-colors"
                          title="Download CSV"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={getReportPdfUrl(entry.id)}
                          download
                          className="p-1 rounded hover:bg-surface-subtle text-text-muted hover:text-primary transition-colors"
                          title="Download PDF"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspected Run Drawer / Card */}
      {selectedRun && (
        <div className="bg-white rounded-2xl border border-surface-border shadow-md p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-primary">
                  Inspection: Run #{selectedRun.id.slice(0, 8)}
                </h3>
                <span className="text-xs bg-accent-light text-primary font-semibold px-2 py-0.5 rounded">
                  {selectedRun.algorithm}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Timestamp: {new Date(selectedRun.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getReportPdfUrl(selectedRun.id)}
                download
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </a>
              <button
                onClick={() => setSelectedRun(null)}
                className="text-xs text-text-muted hover:text-text-main px-2 py-1 rounded"
              >
                Close View
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          {selectedRun.result?.estimated_net_profit && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
                <p className="text-text-muted">Estimated Profit</p>
                <p className="text-base font-bold text-primary font-mono mt-0.5">
                  ₹{selectedRun.result.estimated_net_profit.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
                <p className="text-text-muted">Land Used</p>
                <p className="text-base font-bold text-text-heading font-mono mt-0.5">
                  {selectedRun.result.land_used_ha} ha ({selectedRun.result.land_utilization_pct}%)
                </p>
              </div>
              <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
                <p className="text-text-muted">Water Consumed</p>
                <p className="text-base font-bold text-text-heading font-mono mt-0.5">
                  {(selectedRun.result.water_used_m3 / 1000).toFixed(0)}k m³
                </p>
              </div>
              <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
                <p className="text-text-muted">Budget Spent</p>
                <p className="text-base font-bold text-text-heading font-mono mt-0.5">
                  ₹{(selectedRun.result.budget_used_inr / 100000).toFixed(1)}L
                </p>
              </div>
            </div>
          )}

          {/* Convergence chart if available */}
          {selectedRun.result?.convergence_history?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-text-heading">Evolutionary Convergence Trajectory</h4>
              <ConvergenceChart data={selectedRun.result.convergence_history} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
