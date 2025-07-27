
import React, { useState } from 'react';
import { Worker, AttendanceRecord, UserRole } from '../types';
import { UsersIcon, CheckCircleIcon } from '../components/Icons';
import { AppContext } from '../App';

const INITIAL_WORKERS: Worker[] = [
    { id: 'W1', name: 'Ravi Kumar', role: 'Field Hand', assignedFieldId: 'F1' },
    { id: 'W2', name: 'Sita Sharma', role: 'Field Hand', assignedFieldId: 'F2' },
    { id: 'W3', name: 'Anil Reddy', role: 'Supervisor' },
    { id: 'W4', name: 'Priya Patel', role: 'Technician', assignedFieldId: 'F3' },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
    { id: 'A1', workerId: 'W1', checkIn: new Date(new Date().setHours(8, 2, 0)).toISOString(), checkOut: new Date(new Date().setHours(17, 5, 0)).toISOString(), task: 'Tomato planting' },
    { id: 'A2', workerId: 'W2', checkIn: new Date(new Date().setHours(8, 5, 0)).toISOString(), task: 'Corn field prep' },
];

const Workers: React.FC = () => {
    const { userRole } = React.useContext(AppContext);
    const [workers] = useState<Worker[]>(INITIAL_WORKERS);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
    const [view, setView] = useState<'list' | 'log'>('list');
    
    const handleCheckIn = (workerId: string) => {
        const now = new Date().toISOString();
        setAttendance(prev => [...prev, {id: `A${prev.length+1}`, workerId, checkIn: now, task: 'General Duties'}]);
    };
    
    const handleCheckOut = (workerId: string) => {
        const now = new Date().toISOString();
        setAttendance(prev => prev.map(rec => 
            (rec.workerId === workerId && !rec.checkOut) ? {...rec, checkOut: now} : rec
        ));
    };

    const getWorkerStatus = (workerId: string) => {
        const record = attendance.find(a => a.workerId === workerId && !a.checkOut);
        return record ? 'Checked In' : 'Checked Out';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-text flex items-center">
                    <UsersIcon className="w-8 h-8 mr-3 text-primary" />
                    Worker Management
                </h2>
                <div className="flex space-x-2">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg font-semibold ${view === 'list' ? 'bg-primary text-white' : 'bg-card text-text'}`}>Worker List</button>
                    <button onClick={() => setView('log')} className={`px-4 py-2 rounded-lg font-semibold ${view === 'log' ? 'bg-primary text-white' : 'bg-card text-text'}`}>Attendance Log</button>
                </div>
            </div>

            {view === 'list' ? (
                <div className="bg-card rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-background">
                            <tr>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Assigned Field</th>
                                <th className="p-4 font-semibold">Status</th>
                                {userRole !== UserRole.Worker && <th className="p-4 font-semibold text-center">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map(worker => (
                                <tr key={worker.id} className="border-b last:border-0">
                                    <td className="p-4">{worker.name}</td>
                                    <td className="p-4">{worker.role}</td>
                                    <td className="p-4">{worker.assignedFieldId || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${getWorkerStatus(worker.id) === 'Checked In' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {getWorkerStatus(worker.id)}
                                        </span>
                                    </td>
                                    {userRole !== UserRole.Worker && (
                                        <td className="p-4 text-center">
                                            {getWorkerStatus(worker.id) === 'Checked Out' ? (
                                                <button onClick={() => handleCheckIn(worker.id)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-600">Check In</button>
                                            ) : (
                                                <button onClick={() => handleCheckOut(worker.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600">Check Out</button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-card rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-background">
                            <tr>
                                <th className="p-4 font-semibold">Worker</th>
                                <th className="p-4 font-semibold">Check In</th>
                                <th className="p-4 font-semibold">Check Out</th>
                                <th className="p-4 font-semibold">Task</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.slice().reverse().map(record => (
                                <tr key={record.id} className="border-b last:border-0">
                                    <td className="p-4">{workers.find(w => w.id === record.workerId)?.name}</td>
                                    <td className="p-4">{new Date(record.checkIn).toLocaleString()}</td>
                                    <td className="p-4">{record.checkOut ? new Date(record.checkOut).toLocaleString() : 'Not checked out'}</td>
                                    <td className="p-4">{record.task}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Workers;
