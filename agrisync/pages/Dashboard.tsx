import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Crop } from '../types';
import WeatherWidget from '../components/WeatherWidget';
import { LeafIcon, UsersIcon, SprayCanIcon, MapIcon, AlertTriangleIcon } from '../components/Icons';

const INITIAL_FIELDS: Field[] = [
  { id: 'F1', name: 'North Field', cropId: 'C1' },
  { id: 'F2', name: 'East Field', cropId: 'C2' },
  { id: 'F3', name: 'West Field', cropId: 'C3' },
  { id: 'F4', name: 'South Field' },
];

const INITIAL_CROPS: Crop[] = [
  { id: 'C1', name: 'Tomatoes', type: 'Vegetable', sowDate: '2024-03-15', harvestDate: '2024-07-20', fieldId: 'F1', healthStatus: 'Healthy', photos: [], diseaseLog: [], fertilizerLog: [], waterLog: [] },
  { id: 'C2', name: 'Corn', type: 'Grain', sowDate: '2024-04-01', harvestDate: '2024-09-15', fieldId: 'F2', healthStatus: 'Monitor', photos: [], diseaseLog: [], fertilizerLog: [], waterLog: [] },
  { id: 'C3', name: 'Potatoes', type: 'Tuber', sowDate: '2024-03-20', harvestDate: '2024-08-10', fieldId: 'F3', healthStatus: 'At Risk', photos: [], diseaseLog: [], fertilizerLog: [], waterLog: [] },
];

const FieldCard: React.FC<{ field: Field; crop?: Crop }> = ({ field, crop }) => {
  const navigate = useNavigate();
  const healthColor = {
    'Healthy': 'bg-green-100 border-green-500',
    'Monitor': 'bg-yellow-100 border-yellow-500',
    'At Risk': 'bg-red-100 border-red-500',
  };

  const statusColor = crop ? healthColor[crop.healthStatus] : 'bg-gray-100 border-gray-400';
  
  const handleClick = () => {
    if (crop) {
      navigate(`/crop/${crop.id}`);
    }
  };

  return (
    <div 
        onClick={handleClick}
        className={`p-4 rounded-lg border-2 ${statusColor} shadow-sm flex flex-col justify-between ${crop ? 'cursor-pointer hover:shadow-lg transition-shadow' : 'cursor-default'}`}
    >
      <div>
        <h4 className="font-bold text-lg text-text">{field.name}</h4>
        {crop ? (
          <>
            <p className="text-sm text-muted">{crop.name}</p>
            <div className="mt-2 text-sm flex items-center">
              <span className={`h-3 w-3 rounded-full mr-2 ${healthColor[crop.healthStatus].replace('bg-', 'bg-').replace('-100', '-500')}`}></span>
              {crop.healthStatus}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">Unassigned</p>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-text mb-4">Farm Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg shadow-sm flex items-center space-x-4">
                <LeafIcon className="w-8 h-8 text-primary"/>
                <div>
                    <p className="text-muted text-sm">Active Crops</p>
                    <p className="text-2xl font-bold">3</p>
                </div>
            </div>
             <div className="bg-card p-4 rounded-lg shadow-sm flex items-center space-x-4">
                <UsersIcon className="w-8 h-8 text-blue-500"/>
                <div>
                    <p className="text-muted text-sm">Workers Present</p>
                    <p className="text-2xl font-bold">12 / 15</p>
                </div>
            </div>
             <div className="bg-card p-4 rounded-lg shadow-sm flex items-center space-x-4">
                <SprayCanIcon className="w-8 h-8 text-orange-500"/>
                <div>
                    <p className="text-muted text-sm">Sprays this week</p>
                    <p className="text-2xl font-bold">2</p>
                </div>
            </div>
             <div className="bg-card p-4 rounded-lg shadow-sm flex items-center space-x-4">
                <AlertTriangleIcon className="w-8 h-8 text-red-500"/>
                <div>
                    <p className="text-muted text-sm">Active Alerts</p>
                    <p className="text-2xl font-bold">1</p>
                </div>
            </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-text mb-4 flex items-center">
          <MapIcon className="w-6 h-6 mr-2" />
          Field Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_FIELDS.map((field) => (
            <FieldCard key={field.id} field={field} crop={INITIAL_CROPS.find(c => c.fieldId === field.id)} />
          ))}
        </div>
      </div>

      <WeatherWidget />
    </div>
  );
};

export default Dashboard;