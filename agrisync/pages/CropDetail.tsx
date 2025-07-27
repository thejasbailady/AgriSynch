import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Crop, DiseaseLog, FertilizerLog, WaterLog } from '../types';
import { analyzePlantHealth } from '../services/geminiService';
import { LeafIcon, UploadCloudIcon, BotIcon, CalendarIcon } from '../components/Icons';

const INITIAL_CROPS: Crop[] = [
    { id: 'C1', name: 'Tomatoes', type: 'Vegetable', sowDate: '2024-03-15', harvestDate: '2024-07-20', fieldId: 'F1', healthStatus: 'Healthy', photos: [{id:'p1', url: 'https://picsum.photos/seed/tomato1/400/300', date: '2024-06-10'}], diseaseLog: [], fertilizerLog: [{id:'f1', date:'2024-06-01', type: 'NPK 10-10-10', amount: 5}], waterLog: [{id:'w1', date: '2024-06-15', amount: 50, duration: 30}] },
    { id: 'C2', name: 'Corn', type: 'Grain', sowDate: '2024-04-01', harvestDate: '2024-09-15', fieldId: 'F2', healthStatus: 'Monitor', photos: [{id:'p2', url: 'https://picsum.photos/seed/corn1/400/300', date: '2024-06-12'}], diseaseLog: [], fertilizerLog: [], waterLog: [] },
    { id: 'C3', name: 'Potatoes', type: 'Tuber', sowDate: '2024-03-20', harvestDate: '2024-08-10', fieldId: 'F3', healthStatus: 'At Risk', photos: [{id:'p3', url: 'https://picsum.photos/seed/potato1/400/300', date: '2024-06-14'}], diseaseLog: [{id: 'd1', date:'2024-06-14', symptoms: 'Yellow spots on leaves', severity:'Low', treatment: 'Fungicide spray'}], fertilizerLog: [], waterLog: [] },
    { id: 'C4', name: 'Wheat', type: 'Grain', sowDate: '2024-05-10', harvestDate: '2024-10-25', fieldId: 'F4', healthStatus: 'Healthy', photos: [], diseaseLog: [], fertilizerLog: [], waterLog: [] },
];

interface AiAnalysisResult {
    disease: string;
    confidence: number;
    description: string;
    recommendations: string[];
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const CropDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [crop, setCrop] = useState<Crop | undefined>(INITIAL_CROPS.find(c => c.id === id));
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null);
            setError(null);
        }
    };

    const handleAnalyzeClick = async () => {
        if (!selectedImage) {
            setError("Please select an image first.");
            return;
        }
        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const base64Image = await fileToBase64(selectedImage);
            const response = await analyzePlantHealth(base64Image, selectedImage.type);
            const resultText = response.text;
            if (resultText) {
                 const parsedResult = JSON.parse(resultText);
                 setAnalysisResult(parsedResult);
            } else {
                 setError("AI analysis did not return a valid result.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to analyze image. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!crop) {
        return <div className="text-center text-xl text-muted">Crop not found.</div>;
    }

    const healthColor = {
        'Healthy': 'text-green-600 bg-green-100',
        'Monitor': 'text-yellow-600 bg-yellow-100',
        'At Risk': 'text-red-600 bg-red-100',
    };

    return (
        <div className="space-y-8">
            <div>
                <Link to="/crops" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all crops</Link>
                <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold text-text flex items-center">
                        <LeafIcon className="w-8 h-8 mr-3 text-primary" />
                        {crop.name} Details
                    </h2>
                    <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${healthColor[crop.healthStatus]}`}>
                        {crop.healthStatus}
                    </span>
                </div>
                <div className="mt-2 text-muted flex items-center space-x-4">
                    <span><strong>Type:</strong> {crop.type}</span>
                    <span><strong>Field:</strong> {crop.fieldId}</span>
                    <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1"/><strong>Sown:</strong> {new Date(crop.sowDate).toLocaleDateString()}</span>
                    <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1"/><strong>Harvest:</strong> {new Date(crop.harvestDate).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Analysis Section */}
                <div className="bg-card p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-text mb-4 flex items-center"><BotIcon className="w-6 h-6 mr-2 text-primary"/>AI Disease Detection</h3>
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400"/>
                        <p className="mt-2 text-sm text-muted">
                            {previewUrl ? 'Click to change image' : 'Click to upload a plant image'}
                        </p>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    </div>
                    {previewUrl && (
                        <div className="mt-4">
                            <img src={previewUrl} alt="Plant preview" className="rounded-lg max-h-64 mx-auto"/>
                        </div>
                    )}
                    <button 
                        onClick={handleAnalyzeClick} 
                        disabled={!selectedImage || isAnalyzing}
                        className="mt-4 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isAnalyzing ? (
                             <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing...</>
                        ) : "Analyze with AI"}
                    </button>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    {analysisResult && (
                        <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                             <h4 className="font-bold text-lg text-primary-700">{analysisResult.disease}</h4>
                             <p className="text-sm font-semibold text-primary-600">Confidence: {(analysisResult.confidence * 100).toFixed(0)}%</p>
                             <p className="mt-2 text-sm text-text">{analysisResult.description}</p>
                             <h5 className="mt-3 font-semibold text-text">Recommendations:</h5>
                             <ul className="list-disc list-inside mt-1 text-sm text-text space-y-1">
                                {analysisResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                             </ul>
                        </div>
                    )}
                </div>

                {/* Logs Section */}
                <div className="space-y-6">
                    <div className="bg-card p-4 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg mb-2 text-text">Photo Gallery</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {crop.photos.map(p => <img key={p.id} src={p.url} alt="crop" className="rounded-md w-full h-24 object-cover" />)}
                             {crop.photos.length === 0 && <p className="text-muted text-sm col-span-3">No photos yet.</p>}
                        </div>
                    </div>
                     <div className="bg-card p-4 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg mb-2 text-text">Disease Log</h3>
                        {crop.diseaseLog.length > 0 ? crop.diseaseLog.map(log => <div key={log.id} className="text-sm border-b pb-2 mb-2"><p><strong>{new Date(log.date).toLocaleDateString()}:</strong> {log.symptoms} ({log.severity}) - Treated with {log.treatment}</p></div>) : <p className="text-muted text-sm">No disease history.</p>}
                    </div>
                     <div className="bg-card p-4 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg mb-2 text-text">Fertilizer Log</h3>
                         {crop.fertilizerLog.length > 0 ? crop.fertilizerLog.map(log => <div key={log.id} className="text-sm"><p><strong>{new Date(log.date).toLocaleDateString()}:</strong> {log.amount}kg of {log.type}</p></div>) : <p className="text-muted text-sm">No fertilizer logs.</p>}
                    </div>
                     <div className="bg-card p-4 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg mb-2 text-text">Watering Log</h3>
                         {crop.waterLog.length > 0 ? crop.waterLog.map(log => <div key={log.id} className="text-sm"><p><strong>{new Date(log.date).toLocaleDateString()}:</strong> {log.amount}L for {log.duration} mins</p></div>) : <p className="text-muted text-sm">No watering logs.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropDetail;