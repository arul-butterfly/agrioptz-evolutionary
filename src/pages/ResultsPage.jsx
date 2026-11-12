import React from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Download,
  TrendingUp,
  Droplets,
  DollarSign,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileSpreadsheet,
  FileText,
  Clock,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getReportCsvUrl, getReportPdfUrl } from '../services/api';
import CropAllocationChart from '../charts/CropAllocationChart';
import ProfitBarChart from '../charts/ProfitBarChart';
import ResourceUtilizationChart from '../charts/ResourceUtilizationChart';
import ConvergenceChart from '../charts/ConvergenceChart';

export default function ResultsPage() {
  const { latestResult } = useApp();

  if (!latestResult) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-surface-subtle text-text-muted flex items-center justify-center mx-auto">
          <PieChart className="w-8 h-8 opacity-50" />
        </div>
        <h2 className="text-xl font-bold text-text-heading">No Optimization Results Yet</h2>
        <p className="text-xs text-text-muted leading-relaxed">
          Please run an optimization simulation from the workspace first to view allocations, resource charts, and export reports.
        </p>
        <Link
          to="/optimize"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-sm hover:bg-primary-dark transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Go to Optimization Workspace</span>
        </Link>
      </div>
    );
  }

  const {
    id,
    algorithm,
    allocations = [],
    estimated_net_profit,
    land_used_ha,
    water_used_m3,
    budget_used_inr,
    land_remaining_ha,
    water_remaining_m3,
    budget_remaining_inr,
    land_utilization_pct,
    water_utilization_pct,
    budget_utilization_pct,
    is_feasible,
    execution_time_seconds,
    convergence_history = []
  } = latestResult;

  const totalAllocatedArea = allocations.reduce((acc, curr) => acc + (curr.allocated_area_ha || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Optimization Results
            </h1>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              is_feasible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {is_feasible ? <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
              <span>{is_feasible ? 'FEASIBLE SOLUTION' : 'CONSTRAINTS EXCEEDED'}</span>
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Optimized via {algorithm} • Execution Time: {execution_time_seconds}s • Run ID: {id ? id.slice(0, 8) : 'Direct'}
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          {id && (
            <>
              <a
                href={getReportCsvUrl(id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-surface-border bg-white text-text-main hover:bg-surface-subtle text-xs font-semibold shadow-xs transition-colors"
                download
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV</span>
              </a>

              <a
                href={getReportPdfUrl(id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-xs transition-colors"
                download
              >
                <FileText className="w-4 h-4" />
                <span>Download PDF Report</span>
              </a>
            </>
          )}

          <Link
            to="/optimize"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-subtle text-primary hover:bg-accent-light text-xs font-semibold transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Re-run</span>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Maximum Profit */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Net Profit</span>
            <div className="w-8 h-8 rounded-lg bg-accent-light text-primary flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="text-2xl font-extrabold text-primary">₹{estimated_net_profit?.toLocaleString()}</p>
          <p className="text-[11px] text-text-muted font-medium">Objective Function Z(X)</p>
        </div>

        {/* Land Utilization */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Land Utilization</span>
            <Maximize2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-text-heading">{land_utilization_pct}%</p>
          <p className="text-[11px] text-text-muted">
            {land_used_ha} ha used • {land_remaining_ha} ha free
          </p>
        </div>

        {/* Water Utilization */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Water Utilization</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-text-heading">{water_utilization_pct}%</p>
          <p className="text-[11px] text-text-muted">
            {(water_used_m3 / 1000).toFixed(0)}k m³ used • {(water_remaining_m3 / 1000).toFixed(0)}k m³ left
          </p>
        </div>

        {/* Budget Utilization */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Budget Utilization</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-text-heading">{budget_utilization_pct}%</p>
          <p className="text-[11px] text-text-muted">
            ₹{(budget_used_inr / 100000).toFixed(1)}L used • ₹{(budget_remaining_inr / 100000).toFixed(1)}L left
          </p>
        </div>
      </div>

      {/* Detailed Crop Allocation Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-text-heading">Optimal Crop Allocation Plan</h3>
            <p className="text-xs text-text-muted">Specific land parcels, projected profits, and resource footprints</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-surface-subtle text-text-muted rounded-lg font-mono">
            {allocations.length} Crops Selected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-subtle text-text-heading font-semibold border-b border-surface-border">
              <tr>
                <th className="py-2.5 px-3">Crop Name</th>
                <th className="py-2.5 px-3 text-right">Allocated Area</th>
                <th className="py-2.5 px-3 text-right">Area Share</th>
                <th className="py-2.5 px-3 text-right">Profit / Hectare</th>
                <th className="py-2.5 px-3 text-right">Total Est Profit</th>
                <th className="py-2.5 px-3 text-right">Water Used</th>
                <th className="py-2.5 px-3 text-right">Cultivation Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {allocations.map((crop, idx) => {
                const share = totalAllocatedArea > 0 ? (crop.allocated_area_ha / totalAllocatedArea) * 100 : 0;
                return (
                  <tr key={idx} className="hover:bg-surface-subtle transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-text-heading">{crop.crop_name}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">{crop.allocated_area_ha} ha</td>
                    <td className="py-2.5 px-3 text-right font-mono text-text-muted">{share.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{crop.profit_per_hectare.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-primary">
                      ₹{crop.estimated_total_profit.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-text-muted">
                      {crop.water_consumed_m3.toLocaleString()} m³
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-text-muted">
                      ₹{crop.cultivation_cost_inr.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-surface-subtle font-bold border-t-2 border-surface-border text-text-heading">
              <tr>
                <td className="py-2.5 px-3">Total / Resource Balance</td>
                <td className="py-2.5 px-3 text-right font-mono">{totalAllocatedArea.toFixed(2)} ha</td>
                <td className="py-2.5 px-3 text-right font-mono">100.0%</td>
                <td className="py-2.5 px-3 text-right text-text-muted">—</td>
                <td className="py-2.5 px-3 text-right font-mono text-primary">₹{estimated_net_profit?.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right font-mono">{water_used_m3?.toLocaleString()} m³</td>
                <td className="py-2.5 px-3 text-right font-mono">₹{budget_used_inr?.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Visual Analytics 4-Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Pie */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-heading">Crop Allocation Distribution (ha)</h3>
            <span className="text-[11px] text-text-muted font-medium">{totalAllocatedArea.toFixed(1)} ha Total</span>
          </div>
          <CropAllocationChart allocations={allocations} />
        </div>

        {/* Profit Bar */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-heading">Crop Profitability Contribution (INR)</h3>
            <span className="text-[11px] text-text-muted font-medium">Ranked by Total Profit</span>
          </div>
          <ProfitBarChart allocations={allocations} />
        </div>

        {/* Resource Usage Horizontal Bar */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-heading">Resource Capacity vs Consumption (%)</h3>
            <span className="text-[11px] text-text-muted font-medium">Constraints Enforced</span>
          </div>
          <ResourceUtilizationChart result={latestResult} />
        </div>

        {/* GA Convergence */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-heading">Fitness Evolution Convergence</h3>
            <span className="text-[11px] text-text-muted font-medium">
              {convergence_history.length > 0 ? `${convergence_history.length} Generations` : 'N/A for Greedy'}
            </span>
          </div>
          <ConvergenceChart data={convergence_history} />
        </div>
      </div>

      {/* Academic Disclaimer */}
      <div className="bg-surface-subtle p-4 rounded-xl border border-surface-border text-xs text-text-muted flex items-start gap-2.5">
        <Info className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Decision-Support Notice:</strong> All estimated profits, water requirements, and cultivation budgets are mathematical approximations derived from the input parameters and deterministic optimization models. Real-world agricultural yields and market revenues depend on climatic volatility, pest pressures, local soil conditions, and commodity price shifts.
        </p>
      </div>
    </div>
  );
}
