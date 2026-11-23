import React, { useState } from 'react';
import { X, QrCode, Copy, Check, ShieldCheck } from 'lucide-react';

const QrCodeModal = ({ isOpen, onClose, user, account }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const upiId = account?.upiId || `${user?.email?.split('@')[0] || 'student'}@studentbank`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(user?.fullName || 'Student')}&cu=INR`)}`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-center">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">StudentBank UPI QR</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex flex-col items-center">
          
          <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-xs">
            <img 
              src={qrUrl} 
              alt="UPI QR Code" 
              className="w-48 h-48 rounded-xl object-contain"
            />
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900">{user?.fullName || 'Student'}</h4>
            <p className="text-xs text-slate-500">{user?.collegeName || 'University Student'}</p>
          </div>

          {/* UPI ID Pill */}
          <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-slate-800">{upiId}</span>
            <button
              onClick={copyUpiId}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Accepts GPay, PhonePe, Paytm & BHIM UPI</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default QrCodeModal;
