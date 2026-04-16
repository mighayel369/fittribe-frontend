import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface GenericBarChartProps {
    data: any[];
    categoryKey: string; 
    valueKey: string; 
}

export const GenericBarChart = ({ data, categoryKey, valueKey }: GenericBarChartProps) => {

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <XAxis 
            dataKey={categoryKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#C7D2FE', fontSize: 10, fontWeight: 700 }} 
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}
            itemStyle={{ color: '#fff', fontSize: '10px' }}
          />
          <Bar 
            dataKey={valueKey} 
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};