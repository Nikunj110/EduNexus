import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CustomBarChartProps {
  chartData: any[];
  dataKey: string;
}

const CustomBarChart = ({ chartData, dataKey }: CustomBarChartProps) => {
  // Format data for display
  const formattedData = chartData.map((item) => {
    if (item.subName?.subName) {
      return {
        name: item.subName.subName,
        [dataKey]: item[dataKey],
      };
    }
    return {
      name: item.subject || item.name || 'Unknown',
      [dataKey]: item[dataKey],
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
        <YAxis stroke="hsl(var(--foreground))" />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
