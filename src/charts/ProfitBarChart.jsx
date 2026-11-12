import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function ProfitBarChart({ allocations = [] }) {
  if (!allocations || allocations.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted text-sm bg-surface-subtle/50 rounded-xl border border-dashed border-surface-border">
        No profit distribution data available.
      </div>
    );
  }

  const chartData = allocations.map((item) => ({
    name: item.crop_name,
    profit: Math.round(item.estimated_total_profit),
    profitPerHa: Math.round(item.profit_per_hectare),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            angle={-25} 
            textAnchor="end" 
            interval={0} 
            tick={{ fontSize: 11, fill: '#4B5563' }}
          />
          <YAxis 
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <Tooltip 
            formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Estimated Profit']}
            contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
          />
          <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#14532D' : '#22C55E'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
