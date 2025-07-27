import React from 'react';
import { WeatherDay } from '../types';
import { SunIcon, AlertTriangleIcon } from './Icons';

const MOCK_WEATHER_DATA: WeatherDay[] = [
  { date: 'Today', temp: 28, rainfall: 10, wind: 15, humidity: 60, condition: 'Sunny' },
  { date: 'Mon', temp: 26, rainfall: 60, wind: 25, humidity: 75, condition: 'Rain' },
  { date: 'Tue', temp: 30, rainfall: 5, wind: 12, humidity: 55, condition: 'Sunny' },
  { date: 'Wed', temp: 32, rainfall: 0, wind: 8, humidity: 50, condition: 'Sunny' },
  { date: 'Thu', temp: 29, rainfall: 80, wind: 35, humidity: 85, condition: 'Storm' },
  { date: 'Fri', temp: 27, rainfall: 20, wind: 18, humidity: 65, condition: 'Cloudy' },
  { date: 'Sat', temp: 25, rainfall: 30, wind: 22, humidity: 70, condition: 'Rain' },
];

const WeatherIcon = ({ condition }: { condition: WeatherDay['condition'] }) => {
  switch (condition) {
    case 'Sunny':
      return <SunIcon className="w-8 h-8 text-yellow-500" />;
    case 'Cloudy':
      return <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
    case 'Rain':
      return <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 13v8"/><path d="M8 13v8"/><path d="M12 15v8"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>;
    case 'Storm':
      return <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 16.77-1.24 1.24"/><path d="M16 16.29l1.24 1.24"/><path d="M13.25 21.5h1.5"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>;
    default:
      return <SunIcon className="w-8 h-8 text-yellow-500" />;
  }
};


const WeatherWidget: React.FC = () => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4 text-text flex items-center">
        <SunIcon className="w-5 h-5 mr-2 text-yellow-500" />
        7-Day Forecast
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-7 gap-4 text-center">
        {MOCK_WEATHER_DATA.map((day) => (
          <div key={day.date} className="bg-background p-3 rounded-lg flex flex-col items-center justify-between space-y-2">
            <p className="font-bold text-sm text-text">{day.date}</p>
            <WeatherIcon condition={day.condition} />
            <p className="font-semibold text-lg text-text">{day.temp}°C</p>
             {(day.wind > 30 || day.rainfall > 70) && (
              <AlertTriangleIcon className="w-5 h-5 text-red-500"/>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-muted grid grid-cols-2 md:grid-cols-4 gap-2">
          <p><strong>Rainfall:</strong> {MOCK_WEATHER_DATA[0].rainfall}%</p>
          <p><strong>Humidity:</strong> {MOCK_WEATHER_DATA[0].humidity}%</p>
          <p><strong>Wind:</strong> {MOCK_WEATHER_DATA[0].wind} km/h</p>
           {MOCK_WEATHER_DATA[0].wind > 20 && (
              <span className="text-red-600 font-semibold flex items-center">
                <AlertTriangleIcon className="w-4 h-4 mr-1"/> High wind warning!
              </span>
            )}
      </div>
    </div>
  );
};

export default WeatherWidget;