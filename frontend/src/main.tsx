import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TripPlanProvider } from './context/TripPlanContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TripPlanProvider>
      <App />
    </TripPlanProvider>
  </StrictMode>
);
