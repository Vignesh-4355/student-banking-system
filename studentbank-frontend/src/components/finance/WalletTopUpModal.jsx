import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { X, Wallet, AlertCircle, ArrowDownLeft } from 'lucide-react';

const TOP_UP_PRESETS = [500, 1000, 2000, 5000];

const WalletTopUpModal = ({ isOpen, onClose, onSuccess, currentBalance, upiId }) => {
  const [amount, setAmount] = useState('1000');
  const [source, setSource] = useState('Parents / Bank Transfer (UPI)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const topUpAmt = Number(amount);
    if (!topUpAmt || topUpAmt <= 0) {
      setError('Please provide a valid top-up amount.');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post('/finance/wallet/top-up', {
        amount: topUpAmt,
        source
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to top up wallet');
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Money to Wallet</h3>
              <p className="text-xs text-slate-500">Fast simulated top-up via UPI / Net Banking</p>
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

          {/* Current Wallet Pill */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-emerald-800 font-semibold">Active Digital Balance:</span>
            <span className="font-extrabold text-emerald-700 text-sm">₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Top-Up Amount (₹ INR)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2">
            {TOP_UP_PRESETS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setAmount(p.toString())}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 transition"
              >
                +₹{p}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Funding Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
            >
              <option value="Parents / Bank Transfer (UPI)">Parents Allowance (UPI)</option>
              <option value="State Bank of India (Savings A/c)">State Bank of India (Savings)</option>
              <option value="HDFC / ICICI Student Bank">HDFC / ICICI NetBanking</option>
              <option value="Freelancing / Part-time Tutoring">Part-time Tutoring Stipend</option>
            </select>
          </div>

          <p className="text-[11px] text-slate-400">
            Deposited into UPI ID: <strong className="text-slate-600">{upiId}</strong>
          </p>

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
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/25 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Confirm Top-Up'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default WalletTopUpModal;
