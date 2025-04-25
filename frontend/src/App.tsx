import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './components/dashboard/Dashboard';
import { TripOverviewPage } from './pages/TripOverviewPage';
import { AboutPage } from './pages/AboutPage';
import { DestinationSelectionPage } from './pages/DestinationSelectionPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripDuration } from './types';
import { useNavigate } from 'react-router-dom';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function HomePage() {
  const navigate = useNavigate();
  const [duration, setDuration] = React.useState<TripDuration>({ nights: 3 });

  const handleDateSelect = (date: Date) => {
    // Navigate to destination selection page with trip parameters
    navigate('/select-destination', {
      state: {
        startDate: date,
        nights: duration.nights,
        guests: {
          adults: 2, // Default, could be made dynamic
          children: 0 // Default, could be made dynamic
        }
      }
    });
  };

  return (
    <Hero
      duration={duration}
      setDuration={setDuration}
      onDateSelect={handleDateSelect}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-beige overflow-hidden">
          <Navigation isPaid={false} />
          
          <main className="relative overflow-y-auto hide-scrollbar">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/destinations/:id" element={<TripOverviewPage />} />
              <Route path="/select-destination" element={<DestinationSelectionPage />} />
              <Route
                path="/dashboard/*"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;