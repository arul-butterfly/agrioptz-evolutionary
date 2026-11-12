import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Cpu,
  Layers,
  Scale,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Database,
  Sliders,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  optimizeGenetic,
  optimizeGreedy,
  optimizeCompare
} from '../services/api';

export default function OptimizationPage() {
  const {
    crops,
    constraints,
    gaParams,
    setGaParams,
    setLatestResult,
    setLatestComparison,
    refreshHistory
  } = useApp();

  const navigate = useNavigate();

  const [algorithm, setAlgorithm] = useState('genetic'); // 'genetic' | 'greedy' | 'compare'
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [nRunsForCompare, setNRunsForCompare] = useState(5);

  const handleRun = async () => {
    if (crops.length === 0) {
      setErrorMessage('Please load or add at least one crop before running optimization.');
      return;
    }

    setIsRunning(true);
    setErrorMessage(null);

    try {
      if (algorithm === 'genetic') {
        const result = await optimizeGenetic(crops, constraints, gaParams);
        setLatestResult(result);
        await refreshHistory();
        navigate('/results');
      } else if (algorithm === 'greedy') {
        const result = await optimizeGreedy(crops, constraints);
        setLatestResult(result);
        await refreshHistory();
        navigate('/results');
      } else if (algorithm === 'compare') {
        const cmpResult = await optimizeCompare(crops, constraints, gaParams, nRunsForCompare);
        setLatestComparison(cmpResult);
        setLatestResult(cmpResult.genetic_best);
        await refreshHistory();
        navigate('/comparison');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during optimization.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="pb-4 border-b border-surface-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Optimization Workspace
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Execute evolutionary algorithm or greedy heuristic to find mathematically optimal crop allocation plans.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Optimization Execution Error</p>
            <p className="text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Step 1 & 2 Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Active Dataset */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <p className="font-bold text-xs text-text-heading">Step 1: Crop Dataset</p>
              <p className="text-[11px] text-text-muted">
                {crops.length} crops active ({crops.slice(0, 3).map((c) => c.crop_name).join(', ')}...)
              </p>
            </div>
          </div>
          <Link
            to="/dataset"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Edit Dataset
          </Link>
        </div>

        {/* Step 2: Active Constraints */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <p className="font-bold text-xs text-text-heading">Step 2: Resource Constraints</p>
              <p className="text-[11px] text-text-muted">
                {constraints.total_land_ha} ha • {(constraints.total_water_m3 / 1000).toFixed(0)}k m³ • ₹{(constraints.total_budget_inr / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
          <Link
            to="/constraints"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Adjust Limits
          </Link>
        </div>
      </div>

      {/* Step 3: Algorithm Selection */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
            3
          </span>
          <h2 className="font-bold text-base text-text-heading">Select Optimization Strategy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Genetic Algorithm */}
          <div
            onClick={() => setAlgorithm('genetic')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              algorithm === 'genetic'
                ? 'border-primary bg-emerald-50/40 shadow-sm'
                : 'border-surface-border hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent-light text-primary flex items-center justify-center">
                <Cpu className="w-5 h-5 text-accent" />
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                algorithm === 'genetic' ? 'border-primary bg-primary' : 'border-gray-300'
              }`}>
                {algorithm === 'genetic' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>
            <h3 className="font-bold text-sm text-text-heading">Genetic Algorithm (GA)</h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Iterative evolutionary search using tournament selection, arithmetic crossover, Gaussian mutation, and elitism. Finds global or near-global Pareto frontiers.
            </p>
            <span className="inline-block mt-3 text-[10px] font-semibold text-primary bg-accent-light px-2 py-0.5 rounded">
              Recommended for Complex Trade-offs
            </span>
          </div>

          {/* Greedy Algorithm */}
          <div
            onClick={() => setAlgorithm('greedy')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              algorithm === 'greedy'
                ? 'border-primary bg-emerald-50/40 shadow-sm'
                : 'border-surface-border hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                algorithm === 'greedy' ? 'border-primary bg-primary' : 'border-gray-300'
              }`}>
                {algorithm === 'greedy' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>
            <h3 className="font-bold text-sm text-text-heading">Greedy Baseline</h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Ranks crops strictly by profit per hectare and allocates maximal permissible area to the top-ranked crops until constraints are exhausted.
            </p>
            <span className="inline-block mt-3 text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Deterministic Baseline
            </span>
          </div>

          {/* Compare Both */}
          <div
            onClick={() => setAlgorithm('compare')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              algorithm === 'compare'
                ? 'border-primary bg-emerald-50/40 shadow-sm'
                : 'border-surface-border hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Scale className="w-5 h-5 text-purple-600" />
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                algorithm === 'compare' ? 'border-primary bg-primary' : 'border-gray-300'
              }`}>
                {algorithm === 'compare' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>
            <h3 className="font-bold text-sm text-text-heading">Compare Both (Academic)</h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Executes Greedy once, then repeats GA across multiple random seeds to measure statistical significance, mean, standard deviation, and profit improvement.
            </p>
            <span className="inline-block mt-3 text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              Multi-Seed Rigorous Study
            </span>
          </div>
        </div>
      </div>

      {/* Step 4: Quick Parameters Settings */}
      {(algorithm === 'genetic' || algorithm === 'compare') && (
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h2 className="font-bold text-base text-text-heading">Genetic Algorithm Hyperparameters</h2>
            </div>
            <Link to="/ga-config" className="text-xs font-semibold text-primary hover:underline">
              Advanced GA Settings
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div className="space-y-1">
              <label className="font-semibold text-text-heading">Population Size</label>
              <input
                type="number"
                min="10"
                max="500"
                value={gaParams.population_size}
                onChange={(e) => setGaParams({ ...gaParams, population_size: Number(e.target.value) })}
                className="w-full border border-surface-border rounded-lg px-2.5 py-1.5 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-heading">Generations</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={gaParams.generations}
                onChange={(e) => setGaParams({ ...gaParams, generations: Number(e.target.value) })}
                className="w-full border border-surface-border rounded-lg px-2.5 py-1.5 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-heading">Crossover Rate</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={gaParams.crossover_prob}
                onChange={(e) => setGaParams({ ...gaParams, crossover_prob: Number(e.target.value) })}
                className="w-full border border-surface-border rounded-lg px-2.5 py-1.5 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-heading">Mutation Rate</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.5"
                value={gaParams.mutation_prob}
                onChange={(e) => setGaParams({ ...gaParams, mutation_prob: Number(e.target.value) })}
                className="w-full border border-surface-border rounded-lg px-2.5 py-1.5 font-mono"
              />
            </div>
          </div>

          {algorithm === 'compare' && (
            <div className="pt-2 flex items-center gap-3 text-xs bg-surface-subtle p-3 rounded-xl border border-surface-border">
              <span className="font-semibold text-text-heading">Number of independent GA runs:</span>
              <input
                type="number"
                min="2"
                max="15"
                value={nRunsForCompare}
                onChange={(e) => setNRunsForCompare(Number(e.target.value))}
                className="w-20 border border-surface-border rounded-lg px-2 py-1 font-mono text-center"
              />
              <span className="text-text-muted">
                (Seeds: {[gaParams.random_seed, gaParams.random_seed + 17, gaParams.random_seed + 34].join(', ')}...)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Step 5: Launch CTA & Progress */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-sm text-text-heading">Ready for Execution</h3>
          <p className="text-xs text-text-muted">
            The solution will be computed strictly on the Python backend using NumPy vectorized fitness functions.
          </p>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-75"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <span>Running Optimization Engine...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Optimization</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
