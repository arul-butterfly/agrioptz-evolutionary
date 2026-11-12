import React from 'react';
import { Sprout, ExternalLink, Github, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-border text-sm text-text-muted mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-accent" />
              </div>
              <span className="font-bold text-lg text-primary">AgriOpt</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Empowering agricultural resource planning through Genetic Algorithms and evolutionary optimization.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-text-heading mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/dataset" className="hover:text-primary transition-colors">Crop Datasets</Link></li>
              <li><Link to="/constraints" className="hover:text-primary transition-colors">Resource Constraints</Link></li>
              <li><Link to="/optimize" className="hover:text-primary transition-colors">Optimization Engine</Link></li>
            </ul>
          </div>

          {/* Research & Methods */}
          <div>
            <h4 className="font-semibold text-text-heading mb-3 text-xs uppercase tracking-wider">Methodology</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/ga-config" className="hover:text-primary transition-colors">Genetic Algorithm Engine</Link></li>
              <li><Link to="/comparison" className="hover:text-primary transition-colors">Greedy Baseline Comparison</Link></li>
              <li><Link to="/analytics" className="hover:text-primary transition-colors">Convergence Analytics</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Mathematical Model</Link></li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="font-semibold text-text-heading mb-3 text-xs uppercase tracking-wider">Official Data Sources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.data.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                  <span>data.gov.in (Govt of India)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://www.fao.org/faostat/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                  <span>FAOSTAT (UN FAO)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://agmarknet.gov.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                  <span>Agmarknet (Market Prices)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 AgriOpt Decision Support System. Academic Evolutionary Computing Project.</p>
          <div className="flex items-center gap-4">
            <span className="text-text-muted">Python FastAPI • React.js • Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
