import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { 
  User, 
  GraduationCap, 
  Wallet, 
  ShieldCheck, 
  Building, 
  BookOpen, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  QrCode,
  Edit3,
  Save
} from 'lucide-react';
import OtpModal from '../auth/OtpModal';

const StudentProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    collegeName: '',
    universityName: '',
    courseName: '',
    department: '',
    academicYear: '3rd Year',
    semester: 5,
    monthlyAllowance: 5000,
    state: 'Maharashtra',
    city: 'Mumbai',
    profileImageUrl: ''
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/students/profile');
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData({
          fullName: res.data.fullName || '',
          phoneNumber: res.data.phoneNumber || '',
          collegeName: res.data.collegeName || '',
          universityName: res.data.universityName || '',
          courseName: res.data.courseName || '',
          department: res.data.department || '',
          academicYear: res.data.academicYear || '1st Year',
          semester: res.data.semester || 1,
          monthlyAllowance: res.data.monthlyAllowance || 5000,
          state: res.data.state || 'Karnataka',
          city: res.data.city || 'Bengaluru',
          profileImageUrl: res.data.profileImageUrl || ''
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load student profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await axiosClient.put('/students/profile', formData);
      if (res.success && res.data) {
        setProfile(res.data);
        setIsEditing(false);
        setSuccessMsg('Student profile updated successfully!');
        await refreshProfile();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-16 px-4 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm font-medium text-slate-600">Loading student credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Profile & Wallet Credentials
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your academic verification, college identity, and digital wallet limits.
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              isEditing 
                ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/25'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: Digital Student ID & Wallet Card */}
          <div className="space-y-6">
            
            {/* FinTech Digital Student Card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 shadow-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
                    SB
                  </div>
                  <span className="font-bold text-sm tracking-wider uppercase text-blue-300">
                    StudentBank ID
                  </span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-2xl font-bold border-2 border-white/20 shadow-inner">
                  {profile?.fullName?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{profile?.fullName}</h3>
                  <p className="text-xs text-blue-200 mt-0.5">{profile?.studentIdNumber}</p>
                  <p className="text-[11px] text-slate-300 truncate max-w-[180px]">{profile?.courseName}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>University:</span>
                  <span className="text-white font-medium truncate max-w-[170px] text-right">{profile?.universityName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>College:</span>
                  <span className="text-white font-medium truncate max-w-[170px] text-right">{profile?.collegeName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Year / Semester:</span>
                  <span className="text-white font-medium">{profile?.academicYear} • Sem {profile?.semester}</span>
                </div>
              </div>
            </div>

            {/* Linked Wallet & UPI Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Digital Student Wallet</h4>
                    <p className="text-[11px] text-slate-500">Authorized simulated student balance</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  {profile?.accountStatus || 'ACTIVE'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl mb-4">
                <span className="text-xs text-slate-500 font-medium block">Current Available Balance</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">
                    ₹{Number(profile?.walletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-bold text-slate-500">INR</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Student UPI ID:</span>
                  <span className="font-mono font-semibold text-blue-700">{profile?.upiId || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Account Number:</span>
                  <span className="font-mono font-semibold text-slate-800">{profile?.accountNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Daily Spend Limit:</span>
                  <span className="font-semibold text-slate-800">₹{Number(profile?.dailySpendLimit || 5000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Monthly Budget Cap:</span>
                  <span className="font-semibold text-slate-800">₹{Number(profile?.monthlySpendLimit || 30000).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Verification & Security Status */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security Status
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Email Verification:</span>
                  {profile?.isEmailVerified ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowOtpModal(true)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Two-Factor Auth:</span>
                  <span className="text-slate-500 font-medium">Disabled (Optional)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Security Encryption:</span>
                  <span className="text-slate-800 font-semibold">BCrypt + JWT</span>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN 2 & 3: Detailed Profile View / Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {isEditing ? 'Edit Academic & Personal Details' : 'Student Record Overview'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEditing 
                      ? 'Update your institution info and monthly allowances.'
                      : 'Verified institution record used for scholarship and fee management.'}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
                  Role: {profile?.role || 'ROLE_STUDENT'}
                </span>
              </div>

              {!isEditing ? (
                /* READ-ONLY VIEW */
                <div className="space-y-6">
                  
                  {/* Basic Details */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Student Identity & Contact
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">Full Legal Name</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile?.fullName}</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">Registered Email</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile?.email}</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">Mobile Number</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">+91 {profile?.phoneNumber}</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">City & State</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile?.city}, {profile?.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Details */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Institution & Course Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">University</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile?.universityName}</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">College / Campus</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile?.collegeName}</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">Course / Degree</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile?.courseName}</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">Department</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile?.department}</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">Current Standing</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{profile?.academicYear} (Semester {profile?.semester})</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl">
                        <span className="text-[11px] text-slate-500 font-medium block">Monthly Allowance</span>
                        <span className="text-sm font-bold text-teal-700 mt-0.5 block">₹{Number(profile?.monthlyAllowance || 0).toLocaleString('en-IN')}/month</span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* EDIT FORM */
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">University Name</label>
                      <input
                        type="text"
                        value={formData.universityName}
                        onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">College / Campus</label>
                      <input
                        type="text"
                        value={formData.collegeName}
                        onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Course Name</label>
                      <input
                        type="text"
                        value={formData.courseName}
                        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                      <select
                        value={formData.academicYear}
                        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                        className="w-full py-2.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="Final Year">Final Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                      <select
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                        className="w-full py-2.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                          <option key={sem} value={sem}>Sem {sem}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 truncate">Monthly Allowance (₹)</label>
                      <input
                        type="number"
                        value={formData.monthlyAllowance}
                        onChange={(e) => setFormData({ ...formData, monthlyAllowance: Number(e.target.value) })}
                        className="w-full py-2.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={profile?.email || ''}
        onSuccess={() => loadProfile()}
      />
    </div>
  );
};

export default StudentProfilePage;
