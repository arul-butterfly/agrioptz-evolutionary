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

export default function ResourceUtilizationChart({ result }) {
  if (!result) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted text-sm bg-surface-subtle/50 rounded-xl border border-dashed border-surface-border">
        Run an optimization to view resource utilization percentages.
      </div>
    );
  }

  const data = [
    {
      resource: 'Land',
      utilized: result.land_utilization_pct || 0,
      remaining: Math.max(0, 100 - (result.land_utilization_pct || 0)),
    },
    {
      resource: 'Water',
      utilized: result.water_utilization_pct || 0,
      remaining: Math.max(0, 100 - (result.water_utilization_pct || 0)),
    },
    {
      resource: 'Budget',
      utilized: result.budget_utilization_pct || 0,
      remaining: Math.max(0, 100 - (result.budget_utilization_pct || 0)),
    },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 15, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            tickFormatter={(v) => `${v}%`} 
            tick={{ fontSize: 11, fill: '#6B7280' }} 
          />
          <YAxis 
            type="category" 
            dataKey="resource" 
            tick={{ fontSize: 12, fill: '#1F2937', fontWeight: 500 }} 
          />
          <Tooltip 
            formatter={(value) => [`${Number(value).toFixed(1)}%`]}
            contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar dataKey="utilized" name="Utilized (%)" stackId="a" fill="#14532D" radius={[0, 0, 0, 0]} />
          <Bar dataKey="remaining" name="Available / Buffer (%)" stackId="a" fill="#DCFCE7" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
