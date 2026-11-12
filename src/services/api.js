/**
 * AgriOpt API Service
 * Centralized client for communicating with the FastAPI backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function healthCheck() {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}

export async function fetchCrops() {
  const res = await fetch(`${BASE_URL}/api/crops`);
  if (!res.ok) throw new Error('Failed to load crops');
  return res.json();
}

export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/api/dataset/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail?.message || data.detail || 'Failed to upload dataset');
  }
  return data;
}

export function getSampleDatasetUrl() {
  return `${BASE_URL}/api/dataset/sample`;
}

export async function validateConstraints(crops, constraints) {
  const res = await fetch(`${BASE_URL}/api/constraints/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crops, constraints }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Constraints validation failed');
  }
  return res.json();
}

export async function optimizeGenetic(crops, constraints, gaParams) {
  const res = await fetch(`${BASE_URL}/api/optimize/genetic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      crops,
      constraints,
      ga_params: gaParams,
      algorithm: 'genetic'
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Genetic algorithm optimization failed');
  }
  return res.json();
}

export async function optimizeGreedy(crops, constraints) {
  const res = await fetch(`${BASE_URL}/api/optimize/greedy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      crops,
      constraints,
      algorithm: 'greedy'
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Greedy optimization failed');
  }
  return res.json();
}

export async function optimizeCompare(crops, constraints, gaParams, nRuns = 5) {
  const res = await fetch(`${BASE_URL}/api/optimize/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      crops,
      constraints,
      ga_params: gaParams,
      n_runs: nRuns
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Comparison optimization failed');
  }
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${BASE_URL}/api/optimization/history`);
  if (!res.ok) throw new Error('Failed to load history');
  return res.json();
}

export async function fetchOptimizationById(id) {
  const res = await fetch(`${BASE_URL}/api/optimization/${id}`);
  if (!res.ok) throw new Error('Optimization result not found');
  return res.json();
}

export function getReportCsvUrl(id) {
  return `${BASE_URL}/api/reports/${id}/csv`;
}

export function getReportPdfUrl(id) {
  return `${BASE_URL}/api/reports/${id}/pdf`;
}
