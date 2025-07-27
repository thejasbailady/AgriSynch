
import React, { useState, useMemo, useCallback } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { UserRole, Notification } from './types';

// Import Pages
import Dashboard from './pages/Dashboard';
import Crops from './pages/Crops';
import CropDetail from './pages/CropDetail';
import Workers from './pages/Workers';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';

// Import Components & Icons
import { BellIcon, MapIcon, LeafIcon, UsersIcon, CalendarIcon, BarChartIcon, CheckCircleIcon, AlertTriangleIcon, InfoIcon } from './components/Icons';

// Initial Data (would come from a DB in a real app)
const initialNotifications: Notification[] = [
    { id: '1', message: 'Heavy rain expected tomorrow. Secure equipment.', type: 'Alert', timestamp: new Date().toISOString(), read: false },
    { id: '2', message: 'Pesticide application for potatoes due in 2 days.', type: 'Info', timestamp: new Date().toISOString(), read: false },
    { id: '3', message: 'Worker #3 (Ramesh) checked in late.', type: 'Alert', timestamp: new Date().toISOString(), read: true },
];

export const AppContext = React.createContext<{
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    markAsRead: (id: string) => void;
}>({
    userRole: UserRole.Admin,
    setUserRole: () => {},
    notifications: [],
    setNotifications: () => {},
    markAsRead: () => {},
});

const NAV_LINKS = [
    { to: '/', label: 'Dashboard', icon: MapIcon, role: [UserRole.Admin, UserRole.Supervisor] },
    { to: '/crops', label: 'Crops', icon: LeafIcon, role: [UserRole.Admin, UserRole.Supervisor, UserRole.Worker] },
    { to: '/workers', label: 'Workers', icon: UsersIcon, role: [UserRole.Admin, UserRole.Supervisor] },
    { to: '/schedule', label: 'Schedule', icon: CalendarIcon, role: [UserRole.Admin, UserRole.Supervisor] },
    { to: '/analytics', label: 'Analytics', icon: BarChartIcon, role: [UserRole.Admin] },
];

const Header: React.FC = () => {
    const { userRole, setUserRole, notifications, markAsRead } = React.useContext(AppContext);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
        switch (type) {
            case 'Alert': return <AlertTriangleIcon className="w-5 h-5 text-red-500" />;
            case 'Info': return <InfoIcon className="w-5 h-5 text-blue-500" />;
            case 'Success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
        }
    };

    return (
        <header className="bg-card shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <LeafIcon className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold text-text">AgriSync</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-full hover:bg-background">
                            <BellIcon className="h-6 w-6 text-muted" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{unreadCount}</span>
                            )}
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-xl border border-gray-200">
                                <div className="p-3 font-semibold border-b">Notifications</div>
                                <ul className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <li key={n.id} onClick={() => markAsRead(n.id)} className={`flex items-start p-3 cursor-pointer hover:bg-background ${!n.read ? 'bg-primary-50' : ''}`}>
                                            <NotificationIcon type={n.type} />
                                            <p className="ml-3 text-sm text-text">{n.message}</p>
                                        </li>
                                    )) : <li className="p-4 text-center text-muted">No new notifications.</li>}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div>
                        <select value={userRole} onChange={e => setUserRole(e.target.value as UserRole)} className="bg-background border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-text">
                            <option value={UserRole.Admin}>Admin</option>
                            <option value={UserRole.Supervisor}>Supervisor</option>
                            <option value={UserRole.Worker}>Worker</option>
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Nav: React.FC = () => {
    const { userRole } = React.useContext(AppContext);
    const location = useLocation();

    return (
        <nav className="bg-card shadow-sm">
            <div className="container mx-auto px-4">
                <ul className="flex space-x-2">
                    {NAV_LINKS.filter(link => link.role.includes(userRole)).map(link => (
                         <li key={link.to}>
                            <NavLink 
                                to={link.to} 
                                className={({ isActive }) => 
                                    `flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                                        isActive || (link.to === "/" && location.pathname.startsWith('/crop/'))
                                        ? 'border-primary text-primary' 
                                        : 'border-transparent text-muted hover:text-text'
                                    }`
                                }
                            >
                                <link.icon className="h-5 w-5 mr-2" />
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header />
            <Nav />
            <main className="container mx-auto p-4 md:p-6">
                {children}
            </main>
        </div>
    );
};


const App: React.FC = () => {
    const [userRole, setUserRole] = useState<UserRole>(UserRole.Admin);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const contextValue = useMemo(() => ({
        userRole,
        setUserRole,
        notifications,
        setNotifications,
        markAsRead
    }), [userRole, notifications, markAsRead]);

    return (
        <AppContext.Provider value={contextValue}>
            <HashRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/crops" element={<Crops />} />
                        <Route path="/crop/:id" element={<CropDetail />} />
                        <Route path="/workers" element={<Workers />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                </Layout>
            </HashRouter>
        </AppContext.Provider>
    );
}

export default App;
