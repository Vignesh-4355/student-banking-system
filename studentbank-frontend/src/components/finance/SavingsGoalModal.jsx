import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { X, Target, Sparkles, AlertCircle } from 'lucide-react';

const GOAL_PRESETS = [
  { title: 'MacBook / Coding Laptop', target: 55000, months: 6, category: 'TECH' },
  { title: 'Emergency Student Buffer', target: 10000, months: 4, category: 'EMERGENCY' },
  { title: 'Semester Goa / Trekking Trip', target: 12000, months: 3, category: 'TRAVEL' },
  { title: 'Annual Gate/GRE Course Fee', target: 20000, months: 5, category: 'EDUCATION' }
];

const SavingsGoalModal = ({ isOpen, onClose, onSuccess, walletBalance }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('50000');
  const [targetMonths, setTargetMonths] = useState(6);
  const [initialDeposit, setInitialDeposit] = useState('1000');
  const [category, setCategory] = useState('TECH');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectPreset = (p) => {
    setTitle(p.title);
    setTargetAmount(p.target.toString());
    setTargetMonths(p.months);
    setCategory(p.category);
    setDescription(`Dedicated savings vault for ${p.title.toLowerCase()}`);
  };

  const monthlyRequired = targetAmount && targetMonths > 0
    ? (Number(targetAmount) / Number(targetMonths)).toFixed(0)
    : '0';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a goal title.');
      return;
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      setError('Target amount must be greater than zero.');
      return;
    }
    if (Number(initialDeposit) > walletBalance) {
      setError(`Initial deposit exceeds your current wallet balance (₹${walletBalance.toFixed(2)}).`);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post('/finance/savings-goals', {
        title: title.trim(),
        description: description.trim() || `Goal vault for ${title}`,
        targetAmount: Number(targetAmount),
        targetMonths: Number(targetMonths),
        initialDeposit: Number(initialDeposit) || 0,
        category
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to create savings goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Savings Goal Vault</h3>
              <p className="text-xs text-slate-500">Plan monthly targets & track milestones</p>
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

          {/* Quick Preset Chips */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Popular Student Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GOAL_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => selectPreset(p)}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition text-xs"
                >
                  <p className="font-bold text-slate-800 line-clamp-1">{p.title}</p>
                  <p className="text-[11px] text-blue-600 font-semibold mt-0.5">₹{p.target.toLocaleString('en-IN')} in {p.months}m</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Goal Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. iPad Air for Engineering Notes"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Amount (₹)</label>
              <input
                type="number"
                min="500"
                step="500"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="50000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Duration</label>
              <select
                value={targetMonths}
                onChange={(e) => setTargetMonths(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value={2}>2 Months</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={10}>10 Months</option>
                <option value={12}>1 Year (12 Months)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Deposit (from Wallet)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Goal Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="TECH">Laptop & Tech</option>
                <option value="EMERGENCY">Emergency Buffer</option>
                <option value="TRAVEL">College Trip / Travel</option>
                <option value="EDUCATION">Certifications & Courses</option>
                <option value="GENERAL">General Milestone</option>
              </select>
            </div>
          </div>

          {/* Goal Calculator Preview Banner */}
          <div className="p-3.5 bg-indigo-50 border border-indigo-200/80 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-indigo-950 block">Monthly Target Savings:</span>
              <span className="text-[11px] text-indigo-700">Save this much per month to achieve on time</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-indigo-600">₹{Number(monthlyRequired).toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-indigo-500 block">/ month</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
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
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/25 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Goal Vault'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SavingsGoalModal;
