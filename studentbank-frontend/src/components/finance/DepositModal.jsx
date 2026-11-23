import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { X, PlusCircle, AlertCircle } from 'lucide-react';

const DepositModal = ({ isOpen, onClose, onSuccess, goal, walletBalance }) => {
  const [amount, setAmount] = useState('500');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  const remaining = Number(goal.target) - Number(goal.saved);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const depAmount = Number(amount);
    if (!depAmount || depAmount <= 0) {
      setError('Please provide a valid deposit amount.');
      return;
    }
    if (depAmount > walletBalance) {
      setError(`Deposit exceeds available wallet balance (₹${walletBalance.toFixed(2)}).`);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post(`/finance/savings-goals/${goal.id}/deposit`, {
        amount: depAmount
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to deposit into goal vault');
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
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Deposit to Goal Vault</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{goal.title}</p>
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

          {/* Goal Summary */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Current Progress:</span>
              <span className="font-bold text-slate-900">₹{Number(goal.saved).toLocaleString('en-IN')} / ₹{Number(goal.target).toLocaleString('en-IN')} ({goal.percentage}%)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Remaining to Goal:</span>
              <span className="font-bold text-indigo-600">₹{Math.max(0, remaining).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Available Wallet Balance:</span>
              <span className="font-bold text-emerald-600">₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Amount (₹ INR)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="50"
                step="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none"
                required
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex items-center gap-2">
            {[200, 500, 1000, 2000].map((quickAmt) => (
              <button
                type="button"
                key={quickAmt}
                onClick={() => setAmount(quickAmt.toString())}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 transition"
              >
                +₹{quickAmt}
              </button>
            ))}
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
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/25 transition disabled:opacity-50"
            >
              {loading ? 'Depositing...' : 'Confirm Deposit'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default DepositModal;
