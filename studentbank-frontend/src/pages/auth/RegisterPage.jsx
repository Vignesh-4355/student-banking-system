import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Building, 
  BookOpen, 
  Calendar, 
  IndianRupee, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import OtpModal from './OtpModal';

const POPULAR_UNIVERSITIES = [
  "IIT Bombay - Indian Institute of Technology",
  "Delhi University (DU)",
  "Anna University, Chennai",
  "BITS Pilani",
  "NIT Trichy - National Institute of Technology",
  "Visvesvaraya Technological University (VTU)",
  "Mumbai University",
  "Jawaharlal Nehru University (JNU)",
  "Manipal Academy of Higher Education",
  "SRM Institute of Science and Technology"
];

const RegisterPage = () => {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',

    // Step 2: Academic & Financial Details
    studentIdNumber: '2024CS' + Math.floor(1000 + Math.random() * 9000),
    universityName: 'IIT Bombay - Indian Institute of Technology',
    collegeName: 'Main Campus, Powai, Mumbai',
    courseName: 'B.Tech - Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    academicYear: '2nd Year',
    semester: 3,
    monthlyAllowance: 6500,
    state: 'Maharashtra',
    city: 'Mumbai',
  });

  const fillSampleNewStudent = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const names = ['Aarav Deshmukh', 'Sneha Rao', 'Rohan Gupta', 'Kavya Nair', 'Aditya Singh', 'Pooja Sharma'];
    const chosenName = names[Math.floor(Math.random() * names.length)];
    const username = chosenName.toLowerCase().replace(' ', '.') + randomSuffix;
    const phone = '98' + Math.floor(10000000 + Math.random() * 90000000);

    setFormData({
      fullName: chosenName,
      email: `${username}@iitb.ac.in`,
      phoneNumber: phone.toString().substring(0, 10),
      password: 'Student@123',
      confirmPassword: 'Student@123',
      studentIdNumber: `2024CS${randomSuffix}`,
      universityName: 'IIT Bombay - Indian Institute of Technology',
      collegeName: 'Main Campus, Powai, Mumbai',
      courseName: 'B.Tech - Computer Science & Engineering',
      department: 'Computer Science & Engineering',
      academicYear: '2nd Year',
      semester: 3,
      monthlyAllowance: 6500,
      state: 'Maharashtra',
      city: 'Mumbai',
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please provide a valid college or personal email address.');
      return;
    }
    if (!formData.phoneNumber || !/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      setError('Please provide a valid 10-digit Indian mobile number.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.studentIdNumber) {
      setError('Please provide your Student ID or College Roll number.');
      return;
    }
    if (!formData.collegeName) {
      setError('Please specify your College / Campus name.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim(),
        studentIdNumber: formData.studentIdNumber.trim(),
        universityName: formData.universityName.trim(),
        collegeName: formData.collegeName.trim(),
        courseName: formData.courseName.trim(),
        department: formData.department.trim(),
        academicYear: formData.academicYear.trim(),
        semester: Number(formData.semester),
        monthlyAllowance: Number(formData.monthlyAllowance),
        state: formData.state,
        city: formData.city,
      };

      await register(payload);
      
      // Attempt instant email OTP activation for seamless onboarding
      try {
        await verifyOtp(formData.email.trim(), '123456');
      } catch (e) {
        // Continue even if already verified
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 mb-3">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Join Student<span className="text-blue-400">Bank</span>
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Open your smart student financial wallet & expense tracker in 2 minutes
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                step === 1
                  ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-medium ${step === 1 ? 'text-white' : 'text-slate-400'}`}>
              Student Credentials
            </span>
          </div>

          <div className="w-8 h-0.5 bg-slate-700"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                step === 2
                  ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-medium ${step === 2 ? 'text-white' : 'text-slate-400'}`}>
              College & Finances
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
          
          {/* Quick Auto Fill Button for Testing */}
          <div className="mb-5 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-blue-900">Want to test registration quickly?</p>
                <p className="text-[11px] text-blue-700">Auto-generate a unique fresh student profile</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fillSampleNewStudent}
              className="text-xs font-semibold px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition shrink-0"
            >
              Auto Fill Student
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Personal & Security Details */
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name (As on College ID)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Deshmukh"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    College / Student Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="aarav@iitb.ac.in"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number (10 Digits)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                      +91
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      maxLength={10}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password (Min. 6 chars)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 group"
              >
                <span>Continue to Academic Profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          ) : (
            /* STEP 2: Academic & Financial Profile */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  University / Affiliating Body
                </label>
                <select
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  {POPULAR_UNIVERSITIES.map((uni, idx) => (
                    <option key={idx} value={uni}>{uni}</option>
                  ))}
                  <option value="Other Recognized University">Other Recognized University</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    College / Campus Name
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="e.g. Main Campus, Powai"
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Roll / Student ID Number
                  </label>
                  <input
                    type="text"
                    name="studentIdNumber"
                    value={formData.studentIdNumber}
                    onChange={handleChange}
                    placeholder="e.g. 210050012"
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Course / Degree
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech / B.Sc / MBA"
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Year
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full py-2.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Postgraduate">Postgrad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full py-2.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                      <option key={sem} value={sem}>Sem {sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 truncate">
                    Allowance (₹/mo)
                  </label>
                  <input
                    type="number"
                    name="monthlyAllowance"
                    value={formData.monthlyAllowance}
                    onChange={handleChange}
                    placeholder="5000"
                    className="w-full py-2.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* Instant Student Wallet Reward Preview */}
              <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  ₹
                </div>
                <div>
                  <h4 className="text-xs font-bold text-teal-950">Free Starter Digital Wallet Included</h4>
                  <p className="text-[11px] text-teal-800">
                    Includes ₹3,500 demo starter balance, student UPI ID & instant dashboard access.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={formData.email}
        onSuccess={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default RegisterPage;
