import React from 'react';
import { Cloud, CloudRain, Sun } from 'lucide-react';
import { Destination, TripDuration, Weather } from '../types';

interface WeatherForecastProps {
  destination: Destination;
  duration: TripDuration;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ destination, duration }) => {
  // Mock weather data - replace with actual API call
  const forecast: Weather[] = Array.from({ length: duration.nights + 1 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
    temperature: {
      high: Math.round(70 + Math.random() * 15),
      low: Math.round(50 + Math.random() * 10)
    },
    condition: ['Sunny', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
    icon: ['sun', 'cloud', 'cloud-rain'][Math.floor(Math.random() * 3)]
  }));

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloud':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'cloud-rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {forecast.map((day, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">
              {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            {getWeatherIcon(day.icon)}
          </div>
          <div className="text-sm text-gray-600">
            <div>{day.condition}</div>
            <div>
              H: {day.temperature.high}°F
              <span className="mx-2">|</span>
              L: {day.temperature.low}°F
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};