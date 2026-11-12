import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Droplets,
  DollarSign,
  Maximize2,
  GitBranch,
  BarChart3,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { crops, backendHealthy } = useApp();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-surface-border bg-gradient-to-b from-accent-subtle/50 via-surface-bg to-surface-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-primary text-xs font-semibold tracking-wide border border-accent/20">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                Evolutionary Computing & Decision Support System
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-[1.15]">
                Smart Crop Planning.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-700 to-accent">
                  Maximum Agricultural Profit.
                </span>
              </h1>

              <p className="text-lg text-text-muted leading-relaxed max-w-2xl">
                Optimize your agricultural resources using Genetic Algorithms. Make smarter crop allocation decisions with limited land, water, and budget.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/optimize"
                  className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-base shadow-lg shadow-primary/20 flex items-center gap-2 transition-all hover:translate-y-[-1px]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-surface-subtle text-text-main font-semibold text-base border border-surface-border shadow-sm transition-all"
                >
                  Explore Features
                </a>
              </div>

              {/* Status pills */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>{crops.length > 0 ? `${crops.length} Demonstration Crops Loaded` : 'Ready for Custom CSV'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Real Python Genetic Algorithm</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Strict Feasibility Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Graphic Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-surface-border shadow-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-light text-primary flex items-center justify-center font-bold">
                      <Sprout className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-text-heading">AgriOpt Core Simulation</h3>
                      <p className="text-[11px] text-text-muted">Multi-Constraint Resource Model</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-accent-light text-primary font-medium px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="py-5 space-y-4">
                  {/* Constraint gauges */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-text-muted">
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-600" /> Land Allocation
                      </span>
                      <span className="font-semibold text-primary">100.0 / 100 ha</span>
                    </div>
                    <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full w-full" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-text-muted">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" /> Irrigation Water
                      </span>
                      <span className="font-semibold text-primary">499,656 / 500,000 m³</span>
                    </div>
                    <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full w-[99.9%]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-text-muted">
                        <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Cultivation Budget
                      </span>
                      <span className="font-semibold text-primary">₹3,834,792 / ₹5,000,000</span>
                    </div>
                    <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full w-[76.7%]" />
                    </div>
                  </div>
                </div>

                {/* Simulated Result Box */}
                <div className="bg-surface-bg rounded-xl p-4 border border-surface-border flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-text-muted font-medium">Estimated Net Profit</p>
                    <p className="text-xl font-bold text-primary">₹20,000,000.00</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      +45.5% vs Greedy
                    </span>
                    <p className="text-[10px] text-text-muted mt-0.5">200 Generations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            Advanced Evolutionary Optimization for Agriculture
          </h2>
          <p className="text-text-muted text-sm sm:text-base">
            Modern farming requires allocating land to high-yield crops without exhausting irrigation reservoirs or exceeding operating capital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-accent-light text-primary flex items-center justify-center">
              <Cpu className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text-heading">Genetic Algorithm Engine</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Employs tournament selection, arithmetic crossover, Gaussian mutation, and elitism to iteratively evolve high-profit crop combinations across generations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-text-heading">Multi-Constraint Feasibility</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Rigorous penalty functions and automated proportional scaling guarantee that every generated solution respects available land, water capacity, and budget.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-text-heading">Greedy Baseline Benchmarking</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Provides transparent academic comparison against a deterministic greedy heuristic to empirically prove the real optimization advantage of evolutionary computing.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-sm space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Optimization Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">How AgriOpt Solves Allocation Problems</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-surface-bg border border-surface-border space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
              <h4 className="font-bold text-sm text-text-heading">Upload Crop Data</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Provide yield, market price, cultivation expense, and water requirement per hectare.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-bg border border-surface-border space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">2</div>
              <h4 className="font-bold text-sm text-text-heading">Set Constraints</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Define farm limits: total land (ha), available irrigation water (m³), and cultivation budget (INR).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-bg border border-surface-border space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">3</div>
              <h4 className="font-bold text-sm text-text-heading">Execute Algorithm</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Run Genetic Algorithm with customizable generations, mutation rates, and tournament sizes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-bg border border-surface-border space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">4</div>
              <h4 className="font-bold text-sm text-text-heading">Inspect & Export</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Review interactive charts, compare against Greedy baseline, and download PDF reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section id="tech-stack" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-8">
          <h3 className="text-lg font-bold text-text-heading">Built with Industry-Standard Technologies</h3>
          <p className="text-xs text-text-muted">A complete full-stack academic architecture with pure Python algorithms</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {[
            { name: 'Python 3.14', type: 'Evolutionary Engine' },
            { name: 'FastAPI', type: 'Asynchronous API' },
            { name: 'NumPy & Pandas', type: 'Vector Operations' },
            { name: 'React 18 + Vite', type: 'Responsive UI' },
            { name: 'Tailwind CSS', type: 'SaaS Styling' },
            { name: 'ReportLab', type: 'PDF Generation' }
          ].map((tech) => (
            <div key={tech.name} className="p-4 bg-white rounded-xl border border-surface-border shadow-xs">
              <p className="font-bold text-sm text-primary">{tech.name}</p>
              <p className="text-[11px] text-text-muted mt-1">{tech.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6 pt-6">
        <div className="bg-primary text-white p-10 sm:p-14 rounded-3xl shadow-xl relative overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Optimize Your Agricultural Allocation?
          </h2>
          <p className="text-sm sm:text-base text-accent-light max-w-xl mx-auto opacity-90">
            Launch the simulation workspace with default demonstration crops or upload your regional agricultural dataset.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/optimize"
              className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-base shadow-md transition-all"
            >
              Start Optimization Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
