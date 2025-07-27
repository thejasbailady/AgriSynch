
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { YieldData, CostData } from '../types';

const yieldData: YieldData[] = [
  { season: '2021', yield: 4000 },
  { season: '2022', yield: 3000 },
  { season: '2023', yield: 5000 },
  { season: '2024', yield: 4500 },
];

const costData: CostData[] = [
  { month: 'Jan', cost: 400, output: 240 },
  { month: 'Feb', cost: 300, output: 139 },
  { month: 'Mar', cost: 200, output: 980 },
  { month: 'Apr', cost: 278, output: 390 },
  { month: 'May', cost: 189, output: 480 },
  { month: 'Jun', cost: 239, output: 380 },
];

const AnalyticsCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-card p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4 text-text">Crop Yield Comparison (kg)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yieldData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="yield" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4 text-text">Cost vs. Output Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cost" stroke="#ef4444" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="output" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
