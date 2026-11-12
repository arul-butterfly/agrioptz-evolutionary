import React from 'react';
import {
  Settings,
  Cpu,
  RotateCcw,
  Zap,
  BookOpen,
  Info,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { useApp, DEFAULT_GA_PARAMS } from '../context/AppContext';

export default function GAConfigPage() {
  const { gaParams, setGaParams, resetGaParams } = useApp();

  const setPreset = (preset) => {
    if (preset === 'fast') {
      setGaParams({
        ...gaParams,
        population_size: 50,
        generations: 50,
        crossover_prob: 0.8,
        mutation_prob: 0.1,
        tournament_size: 2,
        elitism_count: 2,
        penalty_coefficient: 1000000
      });
    } else if (preset === 'academic') {
      setGaParams(DEFAULT_GA_PARAMS);
    } else if (preset === 'deep') {
      setGaParams({
        ...gaParams,
        population_size: 200,
        generations: 500,
        crossover_prob: 0.85,
        mutation_prob: 0.2,
        tournament_size: 4,
        elitism_count: 4,
        penalty_coefficient: 2000000
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Genetic Algorithm Configuration
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Fine-tune evolutionary operators, population diversity, selection pressure, and penalty weights.
          </p>
        </div>

        <button
          onClick={resetGaParams}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-surface-border bg-white text-text-muted hover:text-text-main text-xs font-semibold shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Presets Bar */}
      <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs space-y-2">
        <p className="text-xs font-semibold text-text-heading">Algorithm Presets:</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setPreset('fast')}
            className="px-3.5 py-1.5 rounded-lg border border-surface-border bg-surface-subtle hover:bg-accent-light hover:text-primary transition-colors font-medium flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast Interactive (Pop: 50, Gen: 50)</span>
          </button>
          <button
            onClick={() => setPreset('academic')}
            className="px-3.5 py-1.5 rounded-lg border border-surface-border bg-emerald-50 text-primary font-semibold flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span>Standard Academic (Pop: 100, Gen: 200)</span>
          </button>
          <button
            onClick={() => setPreset('deep')}
            className="px-3.5 py-1.5 rounded-lg border border-surface-border bg-surface-subtle hover:bg-accent-light hover:text-primary transition-colors font-medium flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>Deep Exploration (Pop: 200, Gen: 500)</span>
          </button>
        </div>
      </div>

      {/* Hyperparameters Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Population Size */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-bold text-sm text-text-heading">Population Size (N)</label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-primary">
              {gaParams.population_size} individuals
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Number of candidate crop allocation plans evaluated concurrently in each generation. Larger populations preserve genetic diversity and prevent premature convergence.
          </p>
          <input
            type="range"
            min="20"
            max="400"
            step="10"
            value={gaParams.population_size}
            onChange={(e) => setGaParams({ ...gaParams, population_size: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Generations */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-bold text-sm text-text-heading">Generations (Iterations)</label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-primary">
              {gaParams.generations} generations
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Total number of evolutionary reproductive cycles before termination. Allows sufficient cycles for arithmetic crossover and mutation to converge on optimums.
          </p>
          <input
            type="range"
            min="20"
            max="1000"
            step="20"
            value={gaParams.generations}
            onChange={(e) => setGaParams({ ...gaParams, generations: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Crossover Probability */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-bold text-sm text-text-heading">Crossover Probability (Pc)</label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-primary">
              {(gaParams.crossover_prob * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Probability of applying arithmetic blend crossover between two tournament-selected parents. High rates (70%–90%) promote healthy recombination of crop allocations.
          </p>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={gaParams.crossover_prob}
            onChange={(e) => setGaParams({ ...gaParams, crossover_prob: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Mutation Probability */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-bold text-sm text-text-heading">Mutation Probability (Pm)</label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-primary">
              {(gaParams.mutation_prob * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Probability of applying Gaussian perturbation to an individual's crop hectare gene. Introduces novel solutions and escapes local sub-optima.
          </p>
          <input
            type="range"
            min="0.01"
            max="0.4"
            step="0.01"
            value={gaParams.mutation_prob}
            onChange={(e) => setGaParams({ ...gaParams, mutation_prob: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Tournament Size */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-bold text-sm text-text-heading">Tournament Size (k)</label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-primary">
              {gaParams.tournament_size} competitors
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Number of individuals randomly sampled for tournament selection. Higher values increase selection pressure towards high-fitness allocation vectors.
          </p>
          <input
            type="range"
            min="2"
            max="10"
            step="1"
            value={gaParams.tournament_size}
            onChange={(e) => setGaParams({ ...gaParams, tournament_size: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Elitism Count */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-bold text-sm text-text-heading">Elitism Count (E)</label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-primary">
              {gaParams.elitism_count} individuals
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Best individuals copied directly into the next generation without modification, preventing loss of the best-found crop planning solution.
          </p>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={gaParams.elitism_count}
            onChange={(e) => setGaParams({ ...gaParams, elitism_count: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Random Seed */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-bold text-sm text-text-heading">Reproducible Random Seed</label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-primary">
              Seed: {gaParams.random_seed ?? 'None'}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Fixed integer seed ensuring deterministic experimental repeatability for scientific validation and peer review.
          </p>
          <input
            type="number"
            value={gaParams.random_seed ?? 42}
            onChange={(e) => setGaParams({ ...gaParams, random_seed: Number(e.target.value) })}
            className="w-full border border-surface-border rounded-lg px-3 py-1.5 text-xs font-mono"
          />
        </div>

        {/* Penalty Coefficient */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-bold text-sm text-text-heading">Constraint Penalty Weight</label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-primary">
              {gaParams.penalty_coefficient.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Magnitude coefficient penalizing relative constraint violations in land, irrigation volume, or budget.
          </p>
          <input
            type="number"
            step="100000"
            value={gaParams.penalty_coefficient}
            onChange={(e) => setGaParams({ ...gaParams, penalty_coefficient: Number(e.target.value) })}
            className="w-full border border-surface-border rounded-lg px-3 py-1.5 text-xs font-mono"
          />
        </div>
      </div>

      {/* Operator Explanations */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-text-heading">Evolutionary Operators Technical Architecture</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-muted">
          <div className="p-3.5 bg-surface-bg rounded-xl border border-surface-border space-y-1">
            <p className="font-semibold text-text-heading">1. Arithmetic Crossover</p>
            <p>
              Given two parents P1 and P2, offspring are formed via affine combination: <code className="text-primary font-mono">C1 = αP1 + (1-α)P2</code> with random α ∈ [0, 1].
            </p>
          </div>

          <div className="p-3.5 bg-surface-bg rounded-xl border border-surface-border space-y-1">
            <p className="font-semibold text-text-heading">2. Gaussian Mutation</p>
            <p>
              Perturbs allocated crop area by adding zero-mean Gaussian noise: <code className="text-primary font-mono">x' = max(0, x + N(0, σ))</code> with standard deviation σ proportional to total farm land.
            </p>
          </div>

          <div className="p-3.5 bg-surface-bg rounded-xl border border-surface-border space-y-1">
            <p className="font-semibold text-text-heading">3. Feasibility Repair</p>
            <p>
              Infeasible chromosomes violating land, water, or budget constraints undergo proportional down-scaling to ensure strict feasibility at every evolutionary iteration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
