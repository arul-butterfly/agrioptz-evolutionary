import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ConvergenceChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted text-sm bg-surface-subtle/50 rounded-xl border border-dashed border-surface-border">
        No convergence data recorded yet. Run a Genetic Algorithm optimization to track fitness trajectory.
      </div>
    );
  }

  // Sample data points if generations are high (e.g. > 100) for smooth rendering
  const displayData = data.length > 80 
    ? data.filter((_, idx) => idx % Math.ceil(data.length / 80) === 0 || idx === data.length - 1)
    : data;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={displayData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="generation" 
            label={{ value: 'Generation', position: 'insideBottomRight', offset: -5 }} 
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <YAxis 
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <Tooltip 
            formatter={(value, name) => [
              `₹${Number(value).toLocaleString()}`,
              name === 'best_fitness' ? 'Best Fitness' : name === 'mean_fitness' ? 'Mean Fitness' : 'Worst Fitness'
            ]}
            labelFormatter={(label) => `Generation ${label}`}
            contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Line 
            type="monotone" 
            dataKey="best_fitness" 
            name="Best Fitness" 
            stroke="#14532D" 
            strokeWidth={2.5} 
            dot={false} 
            activeDot={{ r: 5 }} 
          />
          <Line 
            type="monotone" 
            dataKey="mean_fitness" 
            name="Mean Fitness" 
            stroke="#22C55E" 
            strokeWidth={1.8} 
            dot={false} 
          />
          <Line 
            type="monotone" 
            dataKey="worst_fitness" 
            name="Worst Fitness" 
            stroke="#94A3B8" 
            strokeWidth={1} 
            strokeDasharray="4 4" 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
