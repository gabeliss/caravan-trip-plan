import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, FileText, Book, ArrowRight, Clock, Moon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export const TripList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-beige-light pb-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">My Trips</h1>
            <p className="text-gray-600">Manage and view your upcoming adventures</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-primary-dark text-beige px-6 py-3 rounded-lg hover:bg-primary-dark/90 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            Plan New Trip
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {user?.trips.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No trips planned yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start planning your next adventure and discover beautiful destinations across the country.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-dark text-beige px-6 py-3 rounded-lg hover:bg-primary-dark/90 transition-colors"
            >
              Plan Your First Trip
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {user?.trips.map((trip, index) => {
              const daysUntilTrip = trip.duration.startDate 
                ? Math.ceil((new Date(trip.duration.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border hover:border-primary-dark/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h2 className="text-xl font-display font-bold text-primary-dark mb-2">
                              {trip.destination.name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {trip.duration.startDate &&
                                    format(new Date(trip.duration.startDate), 'MMM d')} - {' '}
                                  {trip.duration.startDate &&
                                    format(addDays(new Date(trip.duration.startDate), trip.duration.nights), 'MMM d, yyyy')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Moon className="w-4 h-4" />
                                <span>{trip.duration.nights} nights</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{trip.destination.region}</span>
                              </div>
                            </div>
                          </div>

                          {daysUntilTrip !== null && daysUntilTrip > 0 && (
                            <div className="flex items-center gap-2 bg-beige/40 px-3 py-1.5 rounded-full text-sm text-primary-dark">
                              <Clock className="w-4 h-4" />
                              <span>{daysUntilTrip} days until trip</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-6">
                          <button
                            onClick={() => navigate(`/dashboard/trip/${trip.id}`)}
                            className="inline-flex items-center gap-2 bg-primary-dark text-beige px-4 py-2 rounded-lg hover:bg-primary-dark/90 transition-colors text-sm"
                          >
                            <Book className="w-4 h-4" />
                            View Trip Guide
                          </button>
                          <span className="inline-block px-3 py-1 rounded-full bg-[#DC7644]/10 text-[#DC7644] text-sm font-medium">
                            {trip.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};