import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { uploadDataset, getSampleDatasetUrl } from '../services/api';

export default function DatasetPage() {
  const { crops, setCrops } = useApp();
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropData, setNewCropData] = useState({
    crop_name: '',
    yield_per_hectare: 3000,
    price_per_unit: 30,
    cost_per_hectare: 35000,
    water_per_hectare: 5000,
    season: 'Kharif',
    category: 'Cereal',
    minimum_area: 0,
    maximum_area: ''
  });

  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success'|'error', message: '', warnings: [] }
  const [isUploading, setIsUploading] = useState(false);

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Invalid file format. Please upload a comma-separated values (.csv) file.'
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const res = await uploadDataset(file);
      if (res.success) {
        setCrops(res.crops);
        setUploadStatus({
          type: 'success',
          message: `Successfully loaded and validated ${res.n_crops} crops from ${file.name}.`,
          warnings: res.warnings || []
        });
      }
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: err.message || 'Failed to upload and validate CSV.'
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add new crop
  const handleAddCrop = (e) => {
    e.preventDefault();
    if (!newCropData.crop_name.trim()) return;

    const cropObj = {
      ...newCropData,
      yield_per_hectare: Number(newCropData.yield_per_hectare),
      price_per_unit: Number(newCropData.price_per_unit),
      cost_per_hectare: Number(newCropData.cost_per_hectare),
      water_per_hectare: Number(newCropData.water_per_hectare),
      minimum_area: Number(newCropData.minimum_area || 0),
      maximum_area: newCropData.maximum_area ? Number(newCropData.maximum_area) : null
    };

    setCrops([cropObj, ...crops]);
    setShowAddModal(false);
    setNewCropData({
      crop_name: '',
      yield_per_hectare: 3000,
      price_per_unit: 30,
      cost_per_hectare: 35000,
      water_per_hectare: 5000,
      season: 'Kharif',
      category: 'Cereal',
      minimum_area: 0,
      maximum_area: ''
    });
  };

  // Delete crop
  const handleDeleteCrop = (indexToDelete) => {
    if (window.confirm(`Are you sure you want to remove "${crops[indexToDelete].crop_name}"?`)) {
      setCrops(crops.filter((_, idx) => idx !== indexToDelete));
    }
  };

  // Edit crop start
  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditFormData({ ...crops[index] });
  };

  // Save edit
  const handleSaveEdit = (index) => {
    const updated = [...crops];
    updated[index] = {
      ...editFormData,
      yield_per_hectare: Number(editFormData.yield_per_hectare),
      price_per_unit: Number(editFormData.price_per_unit),
      cost_per_hectare: Number(editFormData.cost_per_hectare),
      water_per_hectare: Number(editFormData.water_per_hectare),
      minimum_area: Number(editFormData.minimum_area || 0),
      maximum_area: editFormData.maximum_area ? Number(editFormData.maximum_area) : null
    };
    setCrops(updated);
    setEditingIndex(null);
  };

  // Export current dataset to CSV
  const handleExportCSV = () => {
    if (crops.length === 0) return;
    const headers = ['crop_name', 'yield_per_hectare', 'price_per_unit', 'cost_per_hectare', 'water_per_hectare', 'season', 'category', 'minimum_area', 'maximum_area'];
    const rows = crops.map(c => [
      c.crop_name,
      c.yield_per_hectare,
      c.price_per_unit,
      c.cost_per_hectare,
      c.water_per_hectare,
      c.season || '',
      c.category || '',
      c.minimum_area || 0,
      c.maximum_area || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agriopt_validated_crops_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter crops
  const filteredCrops = crops.filter(c => {
    const matchesSearch = c.crop_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.season && c.season.toLowerCase().includes(search.toLowerCase())) ||
      (c.category && c.category.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory === 'ALL' || c.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', ...new Set(crops.map(c => c.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Crop Dataset Management
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Upload regional agricultural data, inspect parameters, and prepare datasets for optimization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Validating...' : 'Upload CSV'}</span>
          </button>

          <a
            href={getSampleDatasetUrl()}
            download="sample_crops.csv"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-surface-border text-text-main hover:bg-surface-subtle text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Sample CSV</span>
          </a>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-subtle text-primary hover:bg-accent-light text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Active CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Crop</span>
          </button>
        </div>
      </div>

      {/* Validation Status Notice */}
      {uploadStatus && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
            uploadStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-1">
            <p className="font-semibold">{uploadStatus.message}</p>
            {uploadStatus.warnings?.length > 0 && (
              <ul className="list-disc list-inside text-text-muted space-y-0.5">
                {uploadStatus.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={() => setUploadStatus(null)} className="text-text-muted hover:text-text-main">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search crops by name or season..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-surface-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-text-muted whitespace-nowrap">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="text-xs text-text-muted ml-2">
            Showing {filteredCrops.length} of {crops.length} crops
          </span>
        </div>
      </div>

      {/* Crops Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-subtle text-text-heading font-semibold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">Crop Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4 text-right">Yield (kg/ha)</th>
                <th className="py-3 px-4 text-right">Price (₹/kg)</th>
                <th className="py-3 px-4 text-right">Cost (₹/ha)</th>
                <th className="py-3 px-4 text-right">Water (m³/ha)</th>
                <th className="py-3 px-4 text-right">Est Profit (₹/ha)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredCrops.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-text-muted">
                    No crops match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCrops.map((crop, idx) => {
                  const isEditing = editingIndex === idx;
                  const unitProfit = crop.yield_per_hectare * crop.price_per_unit - crop.cost_per_hectare;

                  return isEditing ? (
                    <tr key={idx} className="bg-emerald-50/50">
                      <td className="p-2">
                        <input
                          type="text"
                          value={editFormData.crop_name}
                          onChange={(e) => setEditFormData({ ...editFormData, crop_name: e.target.value })}
                          className="w-full border rounded px-1.5 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editFormData.category || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                          className="w-full border rounded px-1.5 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editFormData.season || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, season: e.target.value })}
                          className="w-full border rounded px-1.5 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editFormData.yield_per_hectare}
                          onChange={(e) => setEditFormData({ ...editFormData, yield_per_hectare: e.target.value })}
                          className="w-full border rounded px-1.5 py-1 text-xs text-right"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editFormData.price_per_unit}
                          onChange={(e) => setEditFormData({ ...editFormData, price_per_unit: e.target.value })}
                          className="w-full border rounded px-1.5 py-1 text-xs text-right"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editFormData.cost_per_hectare}
                          onChange={(e) => setEditFormData({ ...editFormData, cost_per_hectare: e.target.value })}
                          className="w-full border rounded px-1.5 py-1 text-xs text-right"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editFormData.water_per_hectare}
                          onChange={(e) => setEditFormData({ ...editFormData, water_per_hectare: e.target.value })}
                          className="w-full border rounded px-1.5 py-1 text-xs text-right"
                        />
                      </td>
                      <td className="p-2 text-right font-medium text-text-muted">
                        Auto-calc
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSaveEdit(idx)}
                            className="p-1 rounded bg-accent text-white hover:bg-accent-hover"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={idx} className="hover:bg-surface-subtle transition-colors">
                      <td className="py-3 px-4 font-semibold text-text-heading">{crop.crop_name}</td>
                      <td className="py-3 px-4">
                        <span className="bg-surface-subtle text-text-muted px-2 py-0.5 rounded text-[11px]">
                          {crop.category || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-muted">{crop.season || 'All Season'}</td>
                      <td className="py-3 px-4 text-right font-mono">{Number(crop.yield_per_hectare).toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono">₹{Number(crop.price_per_unit).toFixed(1)}</td>
                      <td className="py-3 px-4 text-right font-mono">₹{Number(crop.cost_per_hectare).toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono">{Number(crop.water_per_hectare).toLocaleString()}</td>
                      <td className={`py-3 px-4 text-right font-semibold font-mono ${unitProfit > 0 ? 'text-primary' : 'text-rose-600'}`}>
                        ₹{unitProfit.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEdit(idx)}
                            className="p-1 rounded hover:bg-surface-subtle text-text-muted hover:text-primary transition-colors"
                            title="Edit Crop"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCrop(idx)}
                            className="p-1 rounded hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors"
                            title="Delete Crop"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-bold text-base text-text-heading">Add New Crop</h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-main">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-text-heading">Crop Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barley"
                    value={newCropData.crop_name}
                    onChange={(e) => setNewCropData({ ...newCropData, crop_name: e.target.value })}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-heading">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Cereal, Oilseed"
                    value={newCropData.category}
                    onChange={(e) => setNewCropData({ ...newCropData, category: e.target.value })}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-heading">Season</label>
                  <input
                    type="text"
                    placeholder="e.g. Kharif, Rabi"
                    value={newCropData.season}
                    onChange={(e) => setNewCropData({ ...newCropData, season: e.target.value })}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-heading">Yield per Hectare (kg) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCropData.yield_per_hectare}
                    onChange={(e) => setNewCropData({ ...newCropData, yield_per_hectare: e.target.value })}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-heading">Price per Unit (₹/kg) *</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    min="0.1"
                    value={newCropData.price_per_unit}
                    onChange={(e) => setNewCropData({ ...newCropData, price_per_unit: e.target.value })}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-heading">Cost per Hectare (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCropData.cost_per_hectare}
                    onChange={(e) => setNewCropData({ ...newCropData, cost_per_hectare: e.target.value })}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-heading">Water Requirement (m³/ha) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCropData.water_per_hectare}
                    onChange={(e) => setNewCropData({ ...newCropData, water_per_hectare: e.target.value })}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-surface-border text-text-muted hover:bg-surface-subtle font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold"
                >
                  Save Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
