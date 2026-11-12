import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCrops, healthCheck, fetchHistory } from '../services/api';

const AppContext = createContext();

export const DEFAULT_CONSTRAINTS = {
  total_land_ha: 100,
  total_water_m3: 500000,
  total_budget_inr: 5000000,
};

export const DEFAULT_GA_PARAMS = {
  population_size: 100,
  generations: 200,
  crossover_prob: 0.8,
  mutation_prob: 0.15,
  tournament_size: 3,
  elitism_count: 2,
  random_seed: 42,
  penalty_coefficient: 1000000,
};

export function AppProvider({ children }) {
  const [crops, setCrops] = useState([]);
  const [constraints, setConstraints] = useState(DEFAULT_CONSTRAINTS);
  const [gaParams, setGaParams] = useState(DEFAULT_GA_PARAMS);
  const [latestResult, setLatestResult] = useState(null);
  const [latestComparison, setLatestComparison] = useState(null);
  const [history, setHistory] = useState([]);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [isLoadingCrops, setIsLoadingCrops] = useState(true);
  const [error, setError] = useState(null);

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        await healthCheck();
        setBackendHealthy(true);
      } catch (err) {
        console.warn('Backend currently offline or unreachable:', err.message);
        setBackendHealthy(false);
      }

      try {
        const cropData = await fetchCrops();
        if (cropData && cropData.crops) {
          setCrops(cropData.crops);
        }
      } catch (err) {
        console.warn('Failed to load initial crops:', err.message);
      } finally {
        setIsLoadingCrops(false);
      }

      try {
        const historyData = await fetchHistory();
        if (historyData && historyData.history) {
          setHistory(historyData.history);
        }
      } catch (err) {
        // quiet error on history
      }
    }

    init();
  }, []);

  const refreshHistory = async () => {
    try {
      const data = await fetchHistory();
      if (data && data.history) {
        setHistory(data.history);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetConstraints = () => {
    setConstraints(DEFAULT_CONSTRAINTS);
  };

  const resetGaParams = () => {
    setGaParams(DEFAULT_GA_PARAMS);
  };

  return (
    <AppContext.Provider
      value={{
        crops,
        setCrops,
        constraints,
        setConstraints,
        resetConstraints,
        gaParams,
        setGaParams,
        resetGaParams,
        latestResult,
        setLatestResult,
        latestComparison,
        setLatestComparison,
        history,
        setHistory,
        refreshHistory,
        backendHealthy,
        isLoadingCrops,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
