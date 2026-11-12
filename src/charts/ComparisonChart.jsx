import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ComparisonChart({ comparison }) {
  if (!comparison || !comparison.greedy || !comparison.genetic_best) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted text-sm bg-surface-subtle/50 rounded-xl border border-dashed border-surface-border">
        No comparison data available. Run an algorithm comparison to generate this visualization.
      </div>
    );
  }

  const { greedy, genetic_best } = comparison;

  const data = [
    {
      metric: 'Profit (₹k)',
      Greedy: Math.round(greedy.estimated_net_profit / 1000),
      'Genetic Algorithm': Math.round(genetic_best.estimated_net_profit / 1000),
    },
    {
      metric: 'Land Used (%)',
      Greedy: greedy.land_utilization_pct,
      'Genetic Algorithm': genetic_best.land_utilization_pct,
    },
    {
      metric: 'Water Used (%)',
      Greedy: greedy.water_utilization_pct,
      'Genetic Algorithm': genetic_best.water_utilization_pct,
    },
    {
      metric: 'Budget Used (%)',
      Greedy: greedy.budget_utilization_pct,
      'Genetic Algorithm': genetic_best.budget_utilization_pct,
    },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 15, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="metric" tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
          <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
          <Tooltip 
            formatter={(value, name, item) => [
              item.payload.metric.includes('Profit') ? `₹${Number(value * 1000).toLocaleString()}` : `${Number(value).toFixed(1)}%`,
              name
            ]}
            contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar dataKey="Greedy" fill="#94A3B8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Genetic Algorithm" fill="#14532D" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
