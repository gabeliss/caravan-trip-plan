import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar,
  MapPin,
  ArrowLeft,
  Clock,
  Moon,
  CheckCircle
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { TripGuidePages } from './TripGuidePages';

export const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const trip = user?.trips.find(t => t.id === id);

  if (!trip) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Trip not found</h2>
        <Link
          to="/dashboard"
          className="text-blue-600 hover:text-blue-700"
        >
          Back to My Trips
        </Link>
      </div>
    );
  }

  const daysUntilTrip = trip.duration.startDate 
    ? differenceInDays(new Date(trip.duration.startDate), new Date())
    : null;

  const renderTripStatus = () => {
    if (!daysUntilTrip) return null;

    if (daysUntilTrip <= 0) {
      return (
        <div className="flex items-center gap-2 bg-green-600/20 text-green-800 px-4 py-2 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Trip Complete</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 bg-beige/40 px-4 py-2 rounded-lg text-[#194027]">
        <Clock className="w-5 h-5" />
        <span className="font-medium">{daysUntilTrip} days until trip</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-beige-light">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-[#194027] hover:text-[#194027]/80"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Trips
          </Link>
        </div>

        <div className="space-y-6">
          {/* Trip Header */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-[#194027] mb-2">
                  {trip.destination.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-[#DC7644]/10 text-[#DC7644] text-sm font-medium">
                  {trip.status}
                </span>
              </div>
              {renderTripStatus()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#194027]" />
                <div>
                  <p className="text-sm text-gray-500">Dates</p>
                  <p className="font-medium">
                    {trip.duration.startDate &&
                      format(new Date(trip.duration.startDate), 'MMM d')} - {' '}
                    {trip.duration.startDate &&
                      format(addDays(new Date(trip.duration.startDate), trip.duration.nights), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#194027]" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{trip.duration.nights} nights</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#194027]" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">Northern Michigan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Guide Pages */}
          <TripGuidePages trip={trip} />
        </div>
      </div>
    </div>
  );
};