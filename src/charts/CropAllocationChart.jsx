import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = [
  '#14532D', '#22C55E', '#10B981', '#3B82F6', 
  '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6',
  '#06B6D4', '#84CC16', '#F97316', '#64748B'
];

export default function CropAllocationChart({ allocations = [] }) {
  if (!allocations || allocations.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted text-sm bg-surface-subtle/50 rounded-xl border border-dashed border-surface-border">
        No crop allocation data available.
      </div>
    );
  }

  const chartData = allocations.map((item) => ({
    name: item.crop_name,
    value: Number(item.allocated_area_ha),
    profit: item.estimated_total_profit,
  }));

  const totalArea = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, item) => [
              `${value.toFixed(2)} ha (${((value / (totalArea || 1)) * 100).toFixed(1)}%)`,
              item.payload.name
            ]}
            contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            wrapperStyle={{ fontSize: '12px' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
