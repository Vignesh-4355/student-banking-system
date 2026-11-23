import React, { useState } from 'react';
import { X, Users, Copy, Check, Share2 } from 'lucide-react';

const SplitBillModal = ({ isOpen, onClose, upiId }) => {
  const [billTitle, setBillTitle] = useState('Weekend Dinner / Swiggy');
  const [totalAmount, setTotalAmount] = useState('1200');
  const [roommatesCount, setRoommatesCount] = useState(4);
  const [roommateNames, setRoommateNames] = useState('Rahul, Sneha, Rohan, You');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const total = Number(totalAmount) || 0;
  const count = Math.max(1, Number(roommatesCount) || 1);
  const perPerson = (total / count).toFixed(2);

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId || 'student@studentbank')}&pn=StudentBank&am=${perPerson}&tn=${encodeURIComponent(billTitle)}`;

  const copyPaymentLink = () => {
    navigator.clipboard.writeText(upiDeepLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyShareText = () => {
    const text = `Hey guys! Split for "${billTitle}" is ₹${perPerson} per person (Total: ₹${total} divided by ${count}). Pay directly via UPI: ${upiId || 'student@studentbank'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Roommate Expense Splitter</h3>
              <p className="text-xs text-slate-500">Split shared hostel bills & collect via UPI</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Expense / Bill Purpose</label>
            <input
              type="text"
              value={billTitle}
              onChange={(e) => setBillTitle(e.target.value)}
              placeholder="e.g. Hostel Wi-Fi / Zomato Pizza"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Bill Amount (₹)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Number of People</label>
              <input
                type="number"
                min="2"
                max="20"
                value={roommatesCount}
                onChange={(e) => setRoommatesCount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Roommates Names / Notes</label>
            <input
              type="text"
              value={roommateNames}
              onChange={(e) => setRoommateNames(e.target.value)}
              placeholder="e.g. Rahul, Sneha, Rohan, You"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
            />
          </div>

          {/* Split Calculation Result Card */}
          <div className="p-4 bg-teal-50 border border-teal-200/80 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-teal-800 font-semibold block">Each Person Pays:</span>
              <span className="text-2xl font-black text-teal-700">₹{perPerson}</span>
            </div>
            <div className="text-right text-xs text-teal-900">
              <span className="block font-medium">₹{total} ÷ {count} people</span>
              <span className="text-[11px] text-teal-700">Fair equal split</span>
            </div>
          </div>

          {/* UPI Request Details */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span>Your Receiving UPI ID:</span>
              <span className="font-mono font-bold text-slate-900">{upiId}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={copyShareText}
                className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition text-xs shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Message'}</span>
              </button>
              <button
                type="button"
                onClick={copyPaymentLink}
                className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold flex items-center justify-center gap-1 transition text-xs"
                title="Copy UPI Deep Link"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SplitBillModal;
