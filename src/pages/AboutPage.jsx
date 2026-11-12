import React from 'react';
import {
  Sprout,
  Cpu,
  Layers,
  BookOpen,
  CheckCircle2,
  Code,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  GitBranch,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-5xl pb-12">
      {/* Page Title */}
      <div className="space-y-3 pb-6 border-b border-surface-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-primary text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Academic Evolutionary Computing Project
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          AgriOpt – Crop Planning Optimizer Using a Genetic Algorithm
        </h1>
        <p className="text-sm text-text-muted max-w-3xl leading-relaxed">
          An evolutionary decision-support platform designed to solve the multi-constraint bounded knapsack and continuous land allocation problem in precision agriculture.
        </p>
      </div>

      {/* Project Meta Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-surface-border shadow-xs">
          <p className="text-text-muted font-medium">Domain</p>
          <p className="text-sm font-bold text-text-heading mt-0.5">Agriculture & Evolutionary Computing</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-surface-border shadow-xs">
          <p className="text-text-muted font-medium">Core Algorithm</p>
          <p className="text-sm font-bold text-primary mt-0.5">Genetic Algorithm (Continuous Encoding)</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-surface-border shadow-xs">
          <p className="text-text-muted font-medium">Baseline Benchmark</p>
          <p className="text-sm font-bold text-blue-700 mt-0.5">Resource-Aware Greedy Heuristic</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-surface-border shadow-xs">
          <p className="text-text-muted font-medium">Optimization Target</p>
          <p className="text-sm font-bold text-emerald-700 mt-0.5">Maximize Estimated Net Farm Profit</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-surface-border shadow-xs">
          <p className="text-text-muted font-medium">Constraints Handled</p>
          <p className="text-sm font-bold text-text-heading mt-0.5">Land (ha), Water (m³), Budget (INR)</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-surface-border shadow-xs">
          <p className="text-text-muted font-medium">Implementation</p>
          <p className="text-sm font-bold text-text-heading mt-0.5">Python FastAPI + React + Tailwind</p>
        </div>
      </div>

      {/* Problem Statement & Objectives */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-xs space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-primary">1. Problem Statement & Research Objectives</h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Agricultural decision-makers regularly confront the complex challenge of distributing limited cultivable land across various crop options. Highly profitable commercial crops frequently demand excessive irrigation water or significant upfront cultivation capital. Conversely, drought-tolerant crops may offer modest financial returns. Simple intuition or greedy prioritization often exhausts one resource prematurely, leaving arable land uncultivated or capital depleted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2">
            <h4 className="font-bold text-text-heading flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-accent" /> Key Objectives
            </h4>
            <ul className="space-y-1.5 text-text-muted list-disc list-inside">
              <li>Formulate a mathematically rigorous multi-constraint crop allocation model.</li>
              <li>Develop a customized Genetic Algorithm with non-negative continuous chromosome representation.</li>
              <li>Implement strict feasibility repair mechanisms to eliminate constraint violations.</li>
              <li>Provide empirical baseline comparison against a greedy knapsack heuristic.</li>
            </ul>
          </div>

          <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2">
            <h4 className="font-bold text-text-heading flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-accent" /> Academic Deliverables
            </h4>
            <ul className="space-y-1.5 text-text-muted list-disc list-inside">
              <li>Interactive decision-support platform with real-time parameter tweaking.</li>
              <li>Multi-run statistical evaluation (mean, standard deviation, convergence curve).</li>
              <li>Verifiable end-to-end Python engine using NumPy and FastAPI.</li>
              <li>Automated CSV and PDF formal reporting pipelines.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mathematical Model */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-primary">2. Mathematical Optimization Model</h2>

        <div className="space-y-4 text-xs">
          <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2 font-mono">
            <p className="font-bold text-text-heading font-sans text-xs">Decision Vector:</p>
            <p className="text-primary">X = [x₁, x₂, x₃, ..., xₙ]</p>
            <p className="text-text-muted text-[11px] font-sans">
              where xᵢ represents the land area (in hectares) allocated to crop i.
            </p>
          </div>

          <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2 font-mono">
            <p className="font-bold text-text-heading font-sans text-xs">Profit per Hectare (pᵢ):</p>
            <p className="text-primary">profitᵢ = (yield_per_hectareᵢ × price_per_unitᵢ) - cost_per_hectareᵢ</p>
          </div>

          <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2 font-mono">
            <p className="font-bold text-text-heading font-sans text-xs">Objective Function (Maximize Z):</p>
            <p className="text-primary text-sm font-bold">Maximize: Z(X) = Σᵢ (profitᵢ × xᵢ)</p>
          </div>

          <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2 font-mono">
            <p className="font-bold text-text-heading font-sans text-xs">Resource Constraints:</p>
            <div className="space-y-1 text-primary">
              <p>1. Land Bound: &nbsp; &nbsp; &nbsp; &nbsp; Σᵢ (xᵢ) ≤ Land_Total</p>
              <p>2. Water Bound: &nbsp; &nbsp; &nbsp; &nbsp;Σᵢ (water_per_haᵢ × xᵢ) ≤ Water_Total</p>
              <p>3. Budget Bound: &nbsp; &nbsp; &nbsp; Σᵢ (cost_per_haᵢ × xᵢ) ≤ Budget_Total</p>
              <p>4. Non-Negativity: &nbsp; &nbsp; &nbsp;xᵢ ≥ 0 &nbsp; (∀ i ∈ {'{1, ..., n}'})</p>
              <p>5. Optional Bounds: &nbsp; &nbsp; min_areaᵢ ≤ xᵢ ≤ max_areaᵢ</p>
            </div>
          </div>

          <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2 font-mono">
            <p className="font-bold text-text-heading font-sans text-xs">Fitness Function with Scaled Penalty:</p>
            <p className="text-primary">
              Fitness = Z(X) - λ · [ (ΔLand / Land_Total) + (ΔWater / Water_Total) + (ΔBudget / Budget_Total) ]
            </p>
            <p className="text-text-muted text-[11px] font-sans">
              where Δ represents positive violation excess and λ is the configurable penalty coefficient (default 1e6).
            </p>
          </div>
        </div>
      </section>

      {/* Genetic Algorithm Architecture */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-primary">3. Genetic Algorithm Execution Pipeline</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-bg border border-surface-border space-y-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="font-bold text-text-heading">Initialization & Repair</h4>
            <p className="text-text-muted leading-relaxed">
              Generates diverse individuals using uniform and Dirichlet distributions, repaired to strictly respect bounds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-bg border border-surface-border space-y-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="font-bold text-text-heading">Tournament Selection</h4>
            <p className="text-text-muted leading-relaxed">
              Samples k competitors uniformly at random and selects the highest-fitness individual as parent.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-bg border border-surface-border space-y-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="font-bold text-text-heading">Arithmetic Crossover</h4>
            <p className="text-text-muted leading-relaxed">
              Recombines pairs of parents via blend interpolation α·P₁ + (1-α)·P₂ with crossover probability Pc.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-bg border border-surface-border space-y-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h4 className="font-bold text-text-heading">Elitism & Survivor Selection</h4>
            <p className="text-text-muted leading-relaxed">
              Guarantees the best E solutions survive unaltered into the subsequent generation, ensuring monotonic fitness.
            </p>
          </div>
        </div>
      </section>

      {/* Limitations & Future Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Limitations */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-text-heading">Model Assumptions & Limitations</h3>
          </div>
          <ul className="text-xs text-text-muted space-y-2 list-disc list-inside leading-relaxed">
            <li><strong>Deterministic Crop Prices:</strong> Assumes static market prices during the optimization window; commodity price fluctuations are not dynamically simulated.</li>
            <li><strong>Uniform Soil Productivity:</strong> Treats the designated land as homogeneous without local soil moisture or nutrient gradients.</li>
            <li><strong>Single-Season Snapshot:</strong> Evaluates a single harvest period rather than multi-year crop rotations.</li>
          </ul>
        </div>

        {/* Future Scope */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-base text-text-heading">Future Expansion Scope</h3>
          </div>
          <ul className="text-xs text-text-muted space-y-2 list-disc list-inside leading-relaxed">
            <li><strong>Multi-Objective Pareto Optimization (NSGA-II):</strong> Simultaneously optimizing profit maximization while minimizing total irrigation footprint and fertilizer runoff.</li>
            <li><strong>Machine Learning Yield Prediction:</strong> Integrating regional weather forecasts and satellite remote sensing for predictive yield estimates.</li>
            <li><strong>Crop Rotation Cycles:</strong> Adding inter-temporal constraints for soil nitrogen restoration and disease cycle disruption.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
