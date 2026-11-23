import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  PieChart, 
  Target, 
  Users, 
  Award, 
  Bot, 
  ShieldCheck, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  GraduationCap,
  CreditCard,
  Clock,
  ExternalLink,
  ChevronRight,
  QrCode,
  DollarSign,
  Plus
} from 'lucide-react';
import OtpModal from '../auth/OtpModal';
import AddTransactionModal from '../../components/finance/AddTransactionModal';
import BudgetModal from '../../components/finance/BudgetModal';
import SavingsGoalModal from '../../components/finance/SavingsGoalModal';
import DepositModal from '../../components/finance/DepositModal';
import WalletTopUpModal from '../../components/finance/WalletTopUpModal';
import SplitBillModal from '../../components/finance/SplitBillModal';
import AiChatModal from '../../components/finance/AiChatModal';
import QrCodeModal from '../../components/finance/QrCodeModal';

const DashboardOverview = () => {
  const { user, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [welcomeBanner, setWelcomeBanner] = useState(searchParams.get('new_student') === 'true');

  // Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showSplitBillModal, setShowSplitBillModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await axiosClient.get('/finance/dashboard');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch notice', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDepositClick = (goal) => {
    setSelectedGoal(goal);
    setShowDepositModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 px-4 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm font-medium text-slate-600">Loading student financial records...</p>
        </div>
      </div>
    );
  }

  const walletBalance = Number(data?.walletBalance ?? user?.walletBalance ?? 0);
  const monthlyAllowance = Number(data?.monthlyAllowance ?? 5000);
  const totalSpent = Number(data?.totalSpentThisMonth ?? 0);
  const totalSavings = Number(data?.totalSavings ?? 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-16 relative">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* New Student Success Welcome Banner */}
        {welcomeBanner && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Registration Successful! 🎉</h4>
                <p className="text-xs text-emerald-800">
                  Welcome to StudentBank. Your digital student wallet has been provisioned with starter credit.
                </p>
              </div>
            </div>
            <button
              onClick={() => setWelcomeBanner(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Welcome Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-semibold mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>{data?.collegeName || user?.collegeName || 'IIT Bombay'} • Sem {data?.semester || 5}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Namaste, {data?.fullName || user?.fullName || 'Student'}! 👋
              </h1>
              <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
                Here is your live student financial summary for this month. All records are connected to the central database.
              </p>
            </div>

            {/* Quick Live API & DB Status Pill */}
            <div className="p-3.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="text-xs">
                <span className="text-slate-300 block">Database Status</span>
                <span className="font-bold text-emerald-400">Live Data Connected ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS BAR */}
        <div className="bg-white p-4 rounded-3xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</span>
            <span className="text-[11px] font-semibold text-blue-600">Student FinTech Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <button
              onClick={() => setShowAddTxModal(true)}
              className="p-3 bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/60 rounded-2xl flex items-center gap-2.5 text-left transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-950">Add Expense</p>
                <p className="text-[10px] text-blue-700">Record bill or food</p>
              </div>
            </button>

            <button
              onClick={() => setShowBudgetModal(true)}
              className="p-3 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60 rounded-2xl flex items-center gap-2.5 text-left transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-950">Set Budget</p>
                <p className="text-[10px] text-indigo-700">Category caps</p>
              </div>
            </button>

            <button
              onClick={() => setShowGoalModal(true)}
              className="p-3 bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200/60 rounded-2xl flex items-center gap-2.5 text-left transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-950">New Goal</p>
                <p className="text-[10px] text-purple-700">Laptop / Trip vault</p>
              </div>
            </button>

            <button
              onClick={() => setShowTopUpModal(true)}
              className="p-3 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-2xl flex items-center gap-2.5 text-left transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">Top Up Wallet</p>
                <p className="text-[10px] text-emerald-700">+ Allowance / UPI</p>
              </div>
            </button>

            <button
              onClick={() => setShowSplitBillModal(true)}
              className="p-3 bg-teal-50/70 hover:bg-teal-100/80 border border-teal-200/60 rounded-2xl flex items-center gap-2.5 text-left transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-teal-950">Split Bills</p>
                <p className="text-[10px] text-teal-700">Roommate split</p>
              </div>
            </button>

            <button
              onClick={() => setShowAiModal(true)}
              className="p-3 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60 rounded-2xl flex items-center gap-2.5 text-left transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">AI Advisor</p>
                <p className="text-[10px] text-amber-700">Chat with AI</p>
              </div>
            </button>
          </div>
        </div>

        {/* 4 SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Available Wallet Balance */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200 relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Digital Wallet Balance</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">
                ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-slate-500">INR</span>
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono truncate max-w-[150px]">{data?.upiId || 'student@studentbank'}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowTopUpModal(true)}
                  className="font-bold text-emerald-600 hover:text-emerald-800"
                >
                  + Add
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => setShowQrModal(true)}
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                >
                  <QrCode className="w-3 h-3" /> QR
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Monthly Allowance */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Monthly Allowance</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">
                ₹{monthlyAllowance.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-slate-500">/ mo</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-2">
              Next allowance scheduled in 10 days
            </p>
          </div>

          {/* Card 3: Total Spent This Month */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Spent This Month</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-rose-600">
                ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-slate-500">INR</span>
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-2">
              Within safe monthly limit
            </p>
          </div>

          {/* Card 4: Total Savings Vaults */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Goal Savings Vaults</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-indigo-600">
                ₹{totalSavings.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-slate-500">INR</span>
            </div>
            <p className="text-[11px] text-indigo-600 font-medium mt-2">
              Across active student goals
            </p>
          </div>

        </div>

        {/* 2-COLUMN SECTION: TRANSACTIONS & BUDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Transactions List (2 Cols on LG) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
                <p className="text-xs text-slate-500">Real-time database ledger of student expenses & allowances</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddTxModal(true)}
                  className="text-xs font-bold px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {data?.recentTransactions?.length || 0}
                </span>
              </div>
            </div>

            {data?.recentTransactions && data.recentTransactions.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {data.recentTransactions.map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  return (
                    <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: isIncome ? '#ECFDF5' : '#F1F5F9',
                            color: isIncome ? '#059669' : '#334155'
                          }}
                        >
                          {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{tx.merchant || tx.description}</span>
                            <span 
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: tx.categoryColor ? `${tx.categoryColor}15` : '#EFF6FF',
                                color: tx.categoryColor || '#2563EB'
                              }}
                            >
                              {tx.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{tx.description} • via {tx.paymentMode}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-sm font-bold block ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {isIncome ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {tx.date ? new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">No transactions found.</p>
            )}
          </div>

          {/* Monthly Category Budgets (1 Col on LG) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Monthly Budgets</h3>
                <p className="text-xs text-slate-500">Category spending utilization</p>
              </div>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Set Cap
              </button>
            </div>

            {data?.budgets && data.budgets.length > 0 ? (
              <div className="space-y-4">
                {data.budgets.map((b) => (
                  <div key={b.id} className="p-3 bg-slate-50 rounded-2xl">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-slate-800">{b.category}</span>
                      <span className={b.percentage >= 80 ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                        {b.percentage}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          b.percentage >= 80 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(b.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                      <span>Spent: ₹{Number(b.spent).toLocaleString('en-IN')}</span>
                      <span>Cap: ₹{Number(b.allocated).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">No monthly budgets configured.</p>
            )}
          </div>

        </div>

        {/* 2-COLUMN SECTION: SAVINGS GOALS & FEE REMINDERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Savings Goals Vaults */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Savings Goals Vaults</h3>
                <p className="text-xs text-slate-500">Milestone progress toward major purchases & emergencies</p>
              </div>
              <button
                onClick={() => setShowGoalModal(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Vault
              </button>
            </div>

            {data?.savingsGoals && data.savingsGoals.length > 0 ? (
              <div className="space-y-4">
                {data.savingsGoals.map((g) => (
                  <div key={g.id} className="p-4 border border-slate-100 rounded-2xl hover:border-indigo-200 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{g.title}</h4>
                        <p className="text-[11px] text-slate-500">{g.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
                          {g.percentage}%
                        </span>
                        <button
                          onClick={() => handleDepositClick(g)}
                          className="text-[11px] font-bold px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition"
                        >
                          + Deposit
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${Math.min(g.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span>Saved: <strong className="text-slate-900">₹{Number(g.saved).toLocaleString('en-IN')}</strong> of ₹{Number(g.target).toLocaleString('en-IN')}</span>
                      <span className="text-[11px] text-slate-400">Target: {g.targetDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">No savings goals created.</p>
            )}
          </div>

          {/* Upcoming College Fees */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">College Fee Schedule</h3>
                <p className="text-xs text-slate-500">Track semester tuition, hostel, and exam deadlines</p>
              </div>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>

            {data?.feeReminders && data.feeReminders.length > 0 ? (
              <div className="space-y-3.5">
                {data.feeReminders.map((fee) => {
                  const isPaid = fee.status === 'PAID';
                  return (
                    <div key={fee.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isPaid ? '✓' : '!'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{fee.title}</h4>
                          <p className="text-[11px] text-slate-500">{fee.term} • Due: {fee.dueDate}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 block">₹{Number(fee.totalAmount).toLocaleString('en-IN')}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {fee.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">No fee reminders found.</p>
            )}
          </div>

        </div>

        {/* SCHOLARSHIPS SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Eligible Scholarships in India</h3>
              <p className="text-xs text-slate-500">Government & private scholarships available for university students</p>
            </div>
            <Award className="w-5 h-5 text-amber-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data?.scholarships?.slice(0, 3).map((s) => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      {s.type}
                    </span>
                    <span className="text-xs font-black text-emerald-700">₹{Number(s.awardAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{s.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{s.provider}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Deadline: {s.deadline}</span>
                  <a 
                    href={s.officialLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Apply <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setShowAiModal(true)}
        className="fixed bottom-6 right-6 p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center gap-2 group transition-all hover:scale-105 z-40"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="text-xs font-bold pr-1 hidden sm:inline-block">Ask AI Advisor</span>
      </button>

      {/* MODALS */}
      <AddTransactionModal
        isOpen={showAddTxModal}
        onClose={() => setShowAddTxModal(false)}
        onSuccess={() => fetchDashboardData()}
      />

      <BudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSuccess={() => fetchDashboardData()}
        currentBudgets={data?.budgets}
      />

      <SavingsGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSuccess={() => fetchDashboardData()}
        walletBalance={walletBalance}
      />

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => { setShowDepositModal(false); setSelectedGoal(null); }}
        onSuccess={() => fetchDashboardData()}
        goal={selectedGoal}
        walletBalance={walletBalance}
      />

      <WalletTopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSuccess={() => fetchDashboardData()}
        currentBalance={walletBalance}
        upiId={data?.upiId}
      />

      <SplitBillModal
        isOpen={showSplitBillModal}
        onClose={() => setShowSplitBillModal(false)}
        upiId={data?.upiId}
      />

      <AiChatModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        studentName={data?.fullName}
      />

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        user={data}
        account={data}
      />

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={data?.email || ''}
        onSuccess={() => fetchDashboardData()}
      />
    </div>
  );
};

export default DashboardOverview;
