
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crop, UserRole } from '../types';
import { LeafIcon } from '../components/Icons';
import { AppContext } from '../App';

const INITIAL_CROPS: Crop[] = [
  { id: 'C1', name: 'Tomatoes', type: 'Vegetable', sowDate: '2024-03-15', harvestDate: '2024-07-20', fieldId: 'F1', healthStatus: 'Healthy', photos: [], diseaseLog: [], fertilizerLog: [], waterLog: [] },
  { id: 'C2', name: 'Corn', type: 'Grain', sowDate: '2024-04-01', harvestDate: '2024-09-15', fieldId: 'F2', healthStatus: 'Monitor', photos: [], diseaseLog: [], fertilizerLog: [], waterLog: [] },
  { id: 'C3', name: 'Potatoes', type: 'Tuber', sowDate: '2024-03-20', harvestDate: '2024-08-10', fieldId: 'F3', healthStatus: 'At Risk', photos: [], diseaseLog: [], fertilizerLog: [], waterLog: [] },
  { id: 'C4', name: 'Wheat', type: 'Grain', sowDate: '2024-05-10', harvestDate: '2024-10-25', fieldId: 'F4', healthStatus: 'Healthy', photos: [], diseaseLog: [], fertilizerLog: [], waterLog: [] },
];

const CropCard: React.FC<{ crop: Crop }> = ({ crop }) => {
    const navigate = useNavigate();
    const healthColor = {
        'Healthy': 'text-green-600 bg-green-100',
        'Monitor': 'text-yellow-600 bg-yellow-100',
        'At Risk': 'text-red-600 bg-red-100',
    };

    return (
        <div className="bg-card rounded-lg shadow-md p-4 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-text">{crop.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${healthColor[crop.healthStatus]}`}>
                        {crop.healthStatus}
                    </span>
                </div>
                <p className="text-sm text-muted">{crop.type}</p>
            </div>
            <div className="mt-4 text-sm space-y-2">
                <p><strong>Sown:</strong> {new Date(crop.sowDate).toLocaleDateString()}</p>
                <p><strong>Harvest:</strong> {new Date(crop.harvestDate).toLocaleDateString()}</p>
                <p><strong>Field:</strong> {crop.fieldId}</p>
            </div>
            <button
                onClick={() => navigate(`/crop/${crop.id}`)}
                className="mt-4 w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-primary-600 transition-colors"
            >
                View Details
            </button>
        </div>
    );
};

const Crops: React.FC = () => {
    const { userRole } = React.useContext(AppContext);
    const [crops, setCrops] = useState<Crop[]>(INITIAL_CROPS);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-text flex items-center">
                    <LeafIcon className="w-8 h-8 mr-3 text-primary" />
                    Crop Management
                </h2>
                {userRole === UserRole.Admin && (
                    <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
                        Add New Crop
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {crops.map((crop) => (
                    <CropCard key={crop.id} crop={crop} />
                ))}
            </div>
        </div>
    );
};

export default Crops;
