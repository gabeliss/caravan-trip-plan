import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';

// Higher-order component to handle authentication state
function AuthenticatedApp() {
  const { authCheckComplete, loading } = useAuth();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  
  // Use an effect to only show loading indicator after a small delay
  // This prevents UI flashing for quick auth checks
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!authCheckComplete) {
      timer = setTimeout(() => {
        setShowLoadingIndicator(true);
      }, 300); // Only show loading after 300ms
    } else {
      setShowLoadingIndicator(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [authCheckComplete]);
  
  // If auth check not complete, render nothing or loading indicator
  if (!authCheckComplete) {
    return showLoadingIndicator ? (
      <div className="flex items-center justify-center min-h-screen bg-beige-light">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-green-800">Loading your caravan...</p>
        </div>
      </div>
    ) : (
      // Invisible loading state to prevent flashing
      <div className="min-h-screen bg-beige-light"></div>
    );
  }
  
  // Once auth check is complete, render the app with routes
  return (
    <div className="bg-beige overflow-hidden">
      <Navigation isPaid={false} />
      
      <main className="relative overflow-y-auto hide-scrollbar">
        <Routes>
          <Route path="/login" element={<AuthAwareLoginRoute />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/destinations/:id" element={<TripOverviewPage />} />
          <Route path="/select-destination" element={<DestinationSelectionPage />} />
          <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

// Handles login route behavior - prevents showing login page when already authenticated
function AuthAwareLoginRoute() {
  const { isAuthenticated, loading, authCheckComplete } = useAuth();
  const location = useLocation();
  const isLoggingOut = location.state && (location.state as any).loggingOut;
  
  // Block rendering until auth check is complete (unless explicitly logging out)
  if (!authCheckComplete && !isLoggingOut) {
    // Render an empty container instead of flashing login form
    return <div className="min-h-screen bg-beige-light"></div>;
  }
  
  // Only redirect to dashboard if authenticated AND not in the process of logging out
  if (isAuthenticated && !loading && !isLoggingOut) {
    return <Navigate to="/dashboard" />;
  }
  
  // Otherwise show the login component
  return <Login />;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  
  // Only show loading screen after a short delay
  // This prevents flashing for quick auth checks
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setShowLoadingScreen(true);
      }, 500); // Show loading only after 500ms of loading
    } else {
      setShowLoadingScreen(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);
  
  // Show loading state only after the delay
  if (loading && showLoadingScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <div className="animate-pulse text-primary text-lg">Loading...</div>
      </div>
    );
  }
  
  // If not authenticated, navigate to login
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }
  
  // If still checking but hasn't reached the loading timeout or authenticated
  return <>{children}</>;
}

function HomePage() {
  const navigate = useNavigate();
  const [duration, setDuration] = React.useState<TripDuration>({ nights: 3 });

  const handleDateSelect = (date: Date, guestCount: number) => {
    // Navigate to destination selection page with trip parameters
    navigate('/select-destination', {
      state: {
        startDate: date,
        nights: duration.nights,
        guests: {
          adults: guestCount, // Now uses the selected guest count
          children: 0 // Could be made dynamic in a future enhancement
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
        <ScrollToTop />
        <AuthenticatedApp />
      </Router>
    </AuthProvider>
  );
}

export default App;