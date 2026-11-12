import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Droplets,
  DollarSign,
  Maximize2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useApp, DEFAULT_CONSTRAINTS } from '../context/AppContext';
import { validateConstraints } from '../services/api';

export default function ConstraintsPage() {
  const { crops, constraints, setConstraints, resetConstraints } = useApp();
  const navigate = useNavigate();

  const [validationState, setValidationState] = useState(null); // { valid: bool, errors: [], warnings: [] }
  const [isValidating, setIsValidating] = useState(false);

  const handleLandChange = (val) => {
    setConstraints({ ...constraints, total_land_ha: Math.max(1, Number(val)) });
    setValidationState(null);
  };

  const handleWaterChange = (val) => {
    setConstraints({ ...constraints, total_water_m3: Math.max(1000, Number(val)) });
    setValidationState(null);
  };

  const handleBudgetChange = (val) => {
    setConstraints({ ...constraints, total_budget_inr: Math.max(10000, Number(val)) });
    setValidationState(null);
  };

  const applyPreset = (land, water, budget) => {
    setConstraints({
      total_land_ha: land,
      total_water_m3: water,
      total_budget_inr: budget,
    });
    setValidationState(null);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const res = await validateConstraints(crops, constraints);
      setValidationState(res);
    } catch (err) {
      setValidationState({
        valid: false,
        errors: [err.message || 'Validation request failed.'],
        warnings: [],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleProceed = async () => {
    // Validate first if not validated
    if (!validationState) {
      try {
        const res = await validateConstraints(crops, constraints);
        if (res.valid) {
          navigate('/optimize');
        } else {
          setValidationState(res);
        }
      } catch (err) {
        navigate('/optimize');
      }
    } else if (validationState.valid) {
      navigate('/optimize');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Resource Constraint Configuration
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Specify the strict upper bounds for cultivable land, irrigation water volume, and financial budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetConstraints}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-surface-border bg-white text-text-muted hover:text-text-main text-xs font-semibold shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs space-y-2">
        <p className="text-xs font-semibold text-text-heading">Demonstration Scale Presets:</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyPreset(100, 500000, 5000000)}
            className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface-subtle hover:bg-accent-light hover:text-primary transition-colors font-medium"
          >
            Academic Benchmark (100 ha • 500k m³ • ₹50 Lakh)
          </button>
          <button
            onClick={() => applyPreset(50, 250000, 2500000)}
            className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface-subtle hover:bg-accent-light hover:text-primary transition-colors font-medium"
          >
            Medium Farm (50 ha • 250k m³ • ₹25 Lakh)
          </button>
          <button
            onClick={() => applyPreset(25, 100000, 1200000)}
            className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface-subtle hover:bg-accent-light hover:text-primary transition-colors font-medium"
          >
            Water-Scarce (25 ha • 100k m³ • ₹12 Lakh)
          </button>
          <button
            onClick={() => applyPreset(250, 1500000, 15000000)}
            className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface-subtle hover:bg-accent-light hover:text-primary transition-colors font-medium"
          >
            Large Agricultural Estate (250 ha • 1.5M m³ • ₹1.5 Cr)
          </button>
        </div>
      </div>

      {/* Constraints Sliders & Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Land Constraint */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Maximize2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-heading">Available Land</h3>
              <p className="text-[11px] text-text-muted">Total farm plot area</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="5000"
                step="1"
                value={constraints.total_land_ha}
                onChange={(e) => handleLandChange(e.target.value)}
                className="w-full text-xl font-bold font-mono text-primary border border-surface-border rounded-xl px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="font-semibold text-xs text-text-muted">hectares</span>
            </div>

            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={constraints.total_land_ha}
              onChange={(e) => handleLandChange(e.target.value)}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted font-mono">
              <span>10 ha</span>
              <span>250 ha</span>
              <span>500 ha</span>
            </div>
          </div>
        </div>

        {/* Water Constraint */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-heading">Available Water</h3>
              <p className="text-[11px] text-text-muted">Irrigation reservoir capacity</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1000"
                max="50000000"
                step="10000"
                value={constraints.total_water_m3}
                onChange={(e) => handleWaterChange(e.target.value)}
                className="w-full text-xl font-bold font-mono text-blue-700 border border-surface-border rounded-xl px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="font-semibold text-xs text-text-muted">m³</span>
            </div>

            <input
              type="range"
              min="50000"
              max="2000000"
              step="25000"
              value={constraints.total_water_m3}
              onChange={(e) => handleWaterChange(e.target.value)}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted font-mono">
              <span>50k m³</span>
              <span>1,000k m³</span>
              <span>2,000k m³</span>
            </div>
          </div>
        </div>

        {/* Budget Constraint */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-heading">Cultivation Budget</h3>
              <p className="text-[11px] text-text-muted">Operating capital limit</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-muted">₹</span>
              <input
                type="number"
                min="10000"
                max="100000000"
                step="50000"
                value={constraints.total_budget_inr}
                onChange={(e) => handleBudgetChange(e.target.value)}
                className="w-full text-xl font-bold font-mono text-amber-700 border border-surface-border rounded-xl px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <input
              type="range"
              min="500000"
              max="20000000"
              step="250000"
              value={constraints.total_budget_inr}
              onChange={(e) => handleBudgetChange(e.target.value)}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted font-mono">
              <span>₹5 Lakh</span>
              <span>₹1 Crore</span>
              <span>₹2 Crore</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Constraint Feasibility Inspection */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-text-heading">Constraint Validation & Sanity Inspection</h3>
          </div>
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {isValidating ? 'Validating...' : 'Re-verify with Crop Dataset'}
          </button>
        </div>

        {validationState && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 ${
              validationState.valid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              {validationState.valid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Configured constraints are valid and feasible with the {validationState.n_crops} active crops.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Identified constraint bottlenecks that may prevent optimization:</span>
                </>
              )}
            </div>

            {validationState.errors?.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-rose-700 font-medium pl-2">
                {validationState.errors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            )}

            {validationState.warnings?.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-amber-800 pl-2">
                {validationState.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
            <p className="text-text-muted">Water Allowance per Hectare</p>
            <p className="text-sm font-bold text-text-heading font-mono mt-0.5">
              {(constraints.total_water_m3 / constraints.total_land_ha).toFixed(0)} m³/ha
            </p>
          </div>
          <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
            <p className="text-text-muted">Budget Allowance per Hectare</p>
            <p className="text-sm font-bold text-text-heading font-mono mt-0.5">
              ₹{(constraints.total_budget_inr / constraints.total_land_ha).toLocaleString()}/ha
            </p>
          </div>
          <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
            <p className="text-text-muted">Crops Meeting Budget/Water</p>
            <p className="text-sm font-bold text-primary font-mono mt-0.5">
              {crops.length} of {crops.length} crops
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          onClick={handleProceed}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all"
        >
          <span>Confirm & Proceed to Optimization</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
