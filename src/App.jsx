import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DatasetPage from './pages/DatasetPage';
import ConstraintsPage from './pages/ConstraintsPage';
import OptimizationPage from './pages/OptimizationPage';
import GAConfigPage from './pages/GAConfigPage';
import ResultsPage from './pages/ResultsPage';
import ComparisonPage from './pages/ComparisonPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* 1. Landing Page */}
            <Route index element={<LandingPage />} />
            
            {/* 2. Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* 3. Crop Dataset Management */}
            <Route path="dataset" element={<DatasetPage />} />
            
            {/* 4. Resource Constraints */}
            <Route path="constraints" element={<ConstraintsPage />} />
            
            {/* 5. Crop Optimization */}
            <Route path="optimize" element={<OptimizationPage />} />
            
            {/* 6. Genetic Algorithm Configuration */}
            <Route path="ga-config" element={<GAConfigPage />} />
            
            {/* 7. Optimization Results */}
            <Route path="results" element={<ResultsPage />} />
            
            {/* 8. Algorithm Comparison */}
            <Route path="comparison" element={<ComparisonPage />} />
            
            {/* 9. Analytics & Reports */}
            <Route path="analytics" element={<AnalyticsPage />} />
            
            {/* 10. About Project */}
            <Route path="about" element={<AboutPage />} />
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
