import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Activity, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { backendHealthy } = useApp();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-accent/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-primary">AgriOpt</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent-light text-primary px-1.5 py-0.5 rounded">v1.0</span>
            </div>
            <p className="text-[11px] text-text-muted leading-none hidden sm:block">Crop Planning Optimizer</p>
          </div>
        </Link>

        {/* Center / Navigation Links for Landing */}
        {isLanding && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Methodology</a>
            <a href="#tech-stack" className="hover:text-primary transition-colors">Tech Stack</a>
            <Link to="/about" className="hover:text-primary transition-colors">About Project</Link>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Backend Status indicator */}
          <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-surface-subtle border-surface-border">
            <span className={`w-2 h-2 rounded-full ${backendHealthy ? 'bg-accent animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-text-muted hidden sm:inline">{backendHealthy ? 'Engine Online' : 'Engine Connecting...'}</span>
          </div>

          <Link
            to="/optimize"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-sm transition-all hover:shadow"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Optimizer</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
