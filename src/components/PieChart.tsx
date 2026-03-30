import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  data: { label: string; count: number }[];
  colors?: Record<string, string>;
}

export const GenericPieChart = ({ data, colors = {} }: PieChartProps) => {
  const defaultColors: Record<string, string> = {
    requested: "#6366f1", 
    approved: "#10b981",  
    pending: "#f59e0b",  
    rejected: "#ef4444",  
    "sick": "#ec4899",
    "medical": "#8b5cf6", 
    "casual": "#06b6d4",
    completed: "#1bdf2b",
    cancelled: "#F43F5E",
    confirmed: "#6ad8b3",
    default: "#21b966"
  };

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="label"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[entry.label.toLowerCase()] || defaultColors[entry.label.toLowerCase()] || defaultColors.default}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};