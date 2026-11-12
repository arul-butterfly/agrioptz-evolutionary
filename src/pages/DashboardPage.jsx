import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Droplets,
  DollarSign,
  Maximize2,
  TrendingUp,
  Percent,
  Play,
  Database,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CropAllocationChart from '../charts/CropAllocationChart';
import ProfitBarChart from '../charts/ProfitBarChart';
import ResourceUtilizationChart from '../charts/ResourceUtilizationChart';
import ConvergenceChart from '../charts/ConvergenceChart';

export default function DashboardPage() {
  const {
    crops,
    constraints,
    latestResult,
    history,
    backendHealthy,
    isLoadingCrops
  } = useApp();

  const allocations = latestResult?.allocations || [];
  const convergence = latestResult?.convergence_history || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Agricultural Decision Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Real-time monitoring of crop allocations, resource budgets, and evolutionary optimization metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/optimize"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-sm transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Quick Optimization</span>
          </Link>
        </div>
      </div>

      {/* System Status Alert if not yet run */}
      {!latestResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-emerald-900">
          <Sprout className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Ready for optimization simulation</p>
            <p className="text-emerald-700 text-xs mt-0.5">
              You have {crops.length} crops loaded and constraints set (Land: {constraints.total_land_ha} ha, Water: {constraints.total_water_m3.toLocaleString()} m³, Budget: ₹{constraints.total_budget_inr.toLocaleString()}). Click "Quick Optimization" to compute an optimal crop plan.
            </p>
          </div>
          <Link
            to="/optimize"
            className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-dark flex-shrink-0"
          >
            Run Now
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Land */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Available Land</span>
            <Maximize2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-text-heading">{constraints.total_land_ha} ha</p>
          <p className="text-[10px] text-text-muted">
            {latestResult ? `Used: ${latestResult.land_used_ha} ha` : 'Configured capacity'}
          </p>
        </div>

        {/* Total Water */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Available Water</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-lg font-bold text-text-heading">{(constraints.total_water_m3 / 1000).toFixed(0)}k m³</p>
          <p className="text-[10px] text-text-muted">
            {latestResult ? `Used: ${(latestResult.water_used_m3 / 1000).toFixed(1)}k m³` : 'Irrigation volume'}
          </p>
        </div>

        {/* Total Budget */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Budget</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-text-heading">₹{(constraints.total_budget_inr / 100000).toFixed(1)}L</p>
          <p className="text-[10px] text-text-muted">
            {latestResult ? `Used: ₹${(latestResult.budget_used_inr / 100000).toFixed(1)}L` : 'Working capital'}
          </p>
        </div>

        {/* Number of Crops */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Loaded Crops</span>
            <Database className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg font-bold text-text-heading">{crops.length}</p>
          <p className="text-[10px] text-text-muted">In active dataset</p>
        </div>

        {/* Best Estimated Profit */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Best Profit</span>
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <p className="text-lg font-bold text-primary">
            {latestResult ? `₹${(latestResult.estimated_net_profit / 100000).toFixed(2)}L` : '—'}
          </p>
          <p className="text-[10px] text-text-muted">
            {latestResult ? `${latestResult.algorithm}` : 'Pending run'}
          </p>
        </div>

        {/* Resource Utilization */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Land Utilized</span>
            <Percent className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-lg font-bold text-text-heading">
            {latestResult ? `${latestResult.land_utilization_pct}%` : '—'}
          </p>
          <p className="text-[10px] text-text-muted">
            {latestResult?.is_feasible ? 'Constraint Feasible' : 'Ready'}
          </p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Allocation Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-text-heading">Crop Allocation Distribution (Hectares)</h3>
              <p className="text-[11px] text-text-muted">Proportion of land allocated across crop varieties</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-text-muted">
              {allocations.length} Active Crops
            </span>
          </div>
          <CropAllocationChart allocations={allocations} />
        </div>

        {/* Profit Distribution Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-text-heading">Crop Profitability Distribution (INR)</h3>
              <p className="text-[11px] text-text-muted">Estimated net profit contribution per crop</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-text-muted">
              Estimated Total: ₹{(latestResult?.estimated_net_profit || 0).toLocaleString()}
            </span>
          </div>
          <ProfitBarChart allocations={allocations} />
        </div>

        {/* Resource Utilization Horizontal Bar */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-text-heading">Resource Utilization (%)</h3>
              <p className="text-[11px] text-text-muted">Proportion of available Land, Water, and Budget consumed</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-text-muted">
              Bounds Respected
            </span>
          </div>
          <ResourceUtilizationChart result={latestResult} />
        </div>

        {/* GA Convergence Chart */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-text-heading">Genetic Algorithm Convergence</h3>
              <p className="text-[11px] text-text-muted">Fitness trajectory across evolutionary generations</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-text-muted">
              {convergence.length} Generations
            </span>
          </div>
          <ConvergenceChart data={convergence} />
        </div>
      </div>

      {/* Bottom Section: Recent History & Dataset Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Optimization History */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-text-heading">Recent Optimization History</h3>
              <p className="text-[11px] text-text-muted">Past runs recorded in current session</p>
            </div>
            <Link to="/analytics" className="text-xs text-primary font-semibold hover:underline">
              View All History
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted bg-surface-subtle/50 rounded-xl">
              No historical runs yet. Execute an optimization from the Run Optimization page.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-subtle text-text-muted font-semibold uppercase tracking-wider border-b border-surface-border">
                  <tr>
                    <th className="py-2 px-3">Run ID</th>
                    <th className="py-2 px-3">Algorithm</th>
                    <th className="py-2 px-3">Crops</th>
                    <th className="py-2 px-3">Net Profit</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {history.slice(0, 5).map((h) => (
                    <tr key={h.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted">
                        {h.id.slice(0, 8)}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-text-main">{h.algorithm}</td>
                      <td className="py-2.5 px-3">{h.n_crops}</td>
                      <td className="py-2.5 px-3 font-semibold text-primary">
                        ₹{(h.estimated_net_profit || 0).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Feasible
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-text-muted">
                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dataset Quick Summary Card */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-heading">Active Dataset Info</h3>
            <Link to="/dataset" className="text-xs text-primary font-semibold hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-bg border border-surface-border space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Dataset Status:</span>
                <span className="font-semibold text-primary">Loaded ({crops.length} crops)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Seasons Represented:</span>
                <span className="font-medium text-text-main">Kharif, Rabi, Annual</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">High-profit crops:</span>
                <span className="font-medium text-text-main">Sugarcane, Tomato, Potato</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Low-water crops:</span>
                <span className="font-medium text-text-main">Mustard, Pulses, Millet</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                to="/dataset"
                className="w-full py-2 px-3 rounded-lg border border-surface-border text-center block font-semibold text-text-heading hover:bg-surface-subtle transition-colors"
              >
                Upload Custom CSV
              </Link>
              <Link
                to="/constraints"
                className="w-full py-2 px-3 rounded-lg bg-surface-subtle text-primary text-center block font-semibold hover:bg-accent-light transition-colors"
              >
                Adjust Resource Limits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
