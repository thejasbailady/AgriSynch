
import React, { useState } from 'react';
import { PesticideEntry } from '../types';
import { CalendarIcon, SprayCanIcon } from '../components/Icons';

const INITIAL_SCHEDULE: PesticideEntry[] = [
    { id: 'S1', name: 'Neem Oil', target: 'Aphids', dosage: '2ml/L', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), safetyGuidelines: 'Wear gloves and mask.' },
    { id: 'S2', name: 'Copper Fungicide', target: 'Blight', dosage: '5g/L', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), safetyGuidelines: 'Avoid contact with skin.' },
    { id: 'S3', name: 'Spinosad', target: 'Caterpillars', dosage: '1ml/L', date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), safetyGuidelines: 'Do not apply in direct sunlight.' },
];

const Schedule: React.FC = () => {
    const [schedule] = useState<PesticideEntry[]>(INITIAL_SCHEDULE);
    const [selectedEntry, setSelectedEntry] = useState<PesticideEntry | null>(null);

    const today = new Date();
    today.setHours(0,0,0,0);
    const upcomingEntries = schedule.filter(e => new Date(e.date) >= today);
    const pastEntries = schedule.filter(e => new Date(e.date) < today);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-text flex items-center">
                    <CalendarIcon className="w-8 h-8 mr-3 text-primary" />
                    Pesticide Schedule
                </h2>
                <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
                    Add Spray Event
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upcoming Sprays */}
                <div className="bg-card p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-text">Upcoming Sprays</h3>
                    <div className="space-y-4">
                        {upcomingEntries.length > 0 ? upcomingEntries.map(entry => (
                            <div key={entry.id} onClick={() => setSelectedEntry(entry)} className="p-4 border rounded-lg cursor-pointer hover:bg-primary-50 hover:border-primary">
                                <p className="font-semibold text-lg">{entry.name}</p>
                                <p className="text-sm text-muted">Date: {new Date(entry.date).toLocaleDateString()}</p>
                                <p className="text-sm text-muted">Target: {entry.target}</p>
                            </div>
                        )) : <p className="text-muted">No upcoming sprays scheduled.</p>}
                    </div>
                </div>

                {/* Past Sprays */}
                <div className="bg-card p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-text">Past Sprays</h3>
                    <div className="space-y-4">
                        {pastEntries.length > 0 ? pastEntries.map(entry => (
                            <div key={entry.id} onClick={() => setSelectedEntry(entry)} className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
                                <p className="font-semibold text-lg">{entry.name}</p>
                                <p className="text-sm text-muted">Date: {new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                        )) : <p className="text-muted">No past spray records.</p>}
                    </div>
                </div>
            </div>

            {selectedEntry && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEntry(null)}>
                    <div className="bg-card rounded-lg shadow-xl p-8 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center mb-4">
                            <SprayCanIcon className="w-8 h-8 mr-3 text-primary"/>
                            <h3 className="text-2xl font-bold">{selectedEntry.name}</h3>
                        </div>
                        <div className="space-y-2 text-text">
                            <p><strong>Date:</strong> {new Date(selectedEntry.date).toLocaleDateString()}</p>
                            <p><strong>Target Pest/Disease:</strong> {selectedEntry.target}</p>
                            <p><strong>Dosage:</strong> {selectedEntry.dosage}</p>
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mt-4">
                                <h4 className="font-bold text-yellow-800">Safety Guidelines</h4>
                                <p className="text-sm text-yellow-700">{selectedEntry.safetyGuidelines}</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedEntry(null)} className="mt-6 w-full bg-gray-200 text-text font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
