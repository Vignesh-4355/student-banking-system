import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { X, Bot, Send, Sparkles, User } from 'lucide-react';

const SUGGESTIONS = [
  "How should I manage my ₹5,000 allowance?",
  "How can I save ₹2,000 monthly?",
  "Explain compound interest and SIP",
  "How to reduce canteen expenses?"
];

const AiChatModal = ({ isOpen, onClose, studentName }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello ${studentName || 'Student'}! 👋 I am your StudentBank AI Financial Assistant. Ask me about budgeting your monthly allowance, saving for laptops, cutting canteen splurges, or compounding investments!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: textToSend.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/finance/ai-chat', {
        message: textToSend.trim()
      });

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: res.data.response }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: "I'm having a brief connection hitch. Tip: Stick to the 50/30/20 rule (Needs/Wants/Savings) for your monthly allowance!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 flex flex-col h-[600px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <Bot className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold">StudentBank AI Financial Advisor</h3>
              <p className="text-[11px] text-blue-200">Personalized smart financial intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-blue-200 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Message Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50">
          {messages.map((m, idx) => {
            const isBot = m.sender === 'bot';
            return (
              <div key={idx} className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isBot ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-700 text-white'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  isBot 
                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200/80' 
                    : 'bg-blue-600 text-white shadow-xs'
                }`}>
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <Bot className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing student finances & generating recommendation...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(s)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-full font-medium shrink-0 transition"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 px-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about student budgeting, savings, or fees..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AiChatModal;
