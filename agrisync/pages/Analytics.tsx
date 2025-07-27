
import React from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { BarChartIcon } from '../components/Icons';

const Analytics: React.FC = () => {
  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-text flex items-center">
                <BarChartIcon className="w-8 h-8 mr-3 text-primary" />
                Analytics & Reports
            </h2>
             <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
                Export Reports (CSV/PDF)
            </button>
        </div>
        <AnalyticsCharts />

        <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-text mb-4">Key Insights</h3>
            <ul className="list-disc list-inside space-y-2 text-text">
                <li><strong>Yield Growth:</strong> Crop yield for 2023 was the highest in the last three years, showing a 66% increase from 2022.</li>
                <li><strong>Cost Efficiency:</strong> March showed the highest output relative to cost, suggesting effective resource management during that period.</li>
                <li><strong>Seasonal Trend:</strong> Output generally peaks mid-year, correlating with harvest seasons for major crops.</li>
            </ul>
        </div>
    </div>
  );
};

export default Analytics;
