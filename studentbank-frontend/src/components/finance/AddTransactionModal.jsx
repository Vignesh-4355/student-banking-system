import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { X, ArrowDownLeft, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  { code: 'FOOD_CANTEEN', name: 'Food & Canteen' },
  { code: 'BOOKS_STATIONARY', name: 'Books & Stationary' },
  { code: 'TRAVEL_METRO', name: 'Travel & Metro' },
  { code: 'COLLEGE_FEES', name: 'College & Exam Fees' },
  { code: 'HOSTEL_RENT', name: 'Hostel & PG Rent' },
  { code: 'SUBSCRIPTIONS', name: 'Subscriptions & Tech' },
  { code: 'ENTERTAINMENT', name: 'Entertainment & Outings' },
  { code: 'HEALTHCARE', name: 'Healthcare & Medical' }
];

const AddTransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const [type, setType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [categoryCode, setCategoryCode] = useState('FOOD_CANTEEN');
  const [merchant, setMerchant] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || Number(amount) <= 0) {
      setError('Please specify a positive transaction amount.');
      return;
    }
    if (!merchant.trim()) {
      setError('Please provide merchant, store, or source name.');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post('/finance/transactions', {
        type,
        amount: Number(amount),
        categoryCode: type === 'EXPENSE' ? categoryCode : null,
        merchant: merchant.trim(),
        description: description.trim() || (type === 'EXPENSE' ? `${merchant} payment` : `Received from ${merchant}`),
        paymentMode
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to record transaction');
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
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${type === 'EXPENSE' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {type === 'EXPENSE' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Transaction</h3>
              <p className="text-xs text-slate-500">Live ledger entry with balance update</p>
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

          {/* Type Selector (Expense vs Income) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense (- ₹)
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                type === 'INCOME' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income (+ ₹)
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹ INR)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">₹</span>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>
          </div>

          {/* Merchant / Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {type === 'EXPENSE' ? 'Merchant / Vendor' : 'Source / Sender'}
              </label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder={type === 'EXPENSE' ? 'e.g. Campus Cafeteria' : 'e.g. Monthly Allowance'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="CARD">Debit / ATM Card</option>
                <option value="CASH">Cash in Hand</option>
                <option value="NET_BANKING">Internet Banking</option>
              </select>
            </div>
          </div>

          {/* Category (Expense only) */}
          {type === 'EXPENSE' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expense Category</label>
              <select
                value={categoryCode}
                onChange={(e) => setCategoryCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Afternoon cold coffee & samosa"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
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
              {loading ? 'Saving...' : 'Add Transaction'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddTransactionModal;
