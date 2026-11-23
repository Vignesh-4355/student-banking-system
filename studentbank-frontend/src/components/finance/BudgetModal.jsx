import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { X, PieChart, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  { code: 'FOOD_CANTEEN', name: 'Food & Canteen', defaultCap: 3000 },
  { code: 'BOOKS_STATIONARY', name: 'Books & Stationary', defaultCap: 1500 },
  { code: 'TRAVEL_METRO', name: 'Travel & Metro', defaultCap: 1000 },
  { code: 'COLLEGE_FEES', name: 'College & Exam Fees', defaultCap: 5000 },
  { code: 'HOSTEL_RENT', name: 'Hostel & PG Rent', defaultCap: 8000 },
  { code: 'SUBSCRIPTIONS', name: 'Subscriptions & Tech', defaultCap: 600 },
  { code: 'ENTERTAINMENT', name: 'Entertainment & Outings', defaultCap: 1200 },
  { code: 'HEALTHCARE', name: 'Healthcare & Medical', defaultCap: 800 }
];

const BudgetModal = ({ isOpen, onClose, onSuccess, currentBudgets }) => {
  const [categoryCode, setCategoryCode] = useState('FOOD_CANTEEN');
  const [allocatedAmount, setAllocatedAmount] = useState('3000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCategoryChange = (code) => {
    setCategoryCode(code);
    const matched = CATEGORIES.find(c => c.code === code);
    if (matched) {
      setAllocatedAmount(matched.defaultCap.toString());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allocatedAmount || Number(allocatedAmount) <= 0) {
      setError('Please provide a valid monthly budget limit.');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post('/finance/budgets', {
        categoryCode,
        allocatedAmount: Number(allocatedAmount)
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to update budget limit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Set Monthly Budget</h3>
              <p className="text-xs text-slate-500">Define category spending caps & alert triggers</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Expense Category</label>
            <select
              value={categoryCode}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Spending Cap (₹ INR)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">₹</span>
              <input
                type="number"
                step="50"
                min="100"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
                placeholder="2000"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Overspending warnings trigger when consumption exceeds 80% of this budget cap.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Budget Cap'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default BudgetModal;
