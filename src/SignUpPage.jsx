import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, saveUserRole, saveEmployerProfile } from './firebase';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SignUpPage({ onBack, onSignUpSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'jobseeker',
    // employer specific
    companyName: '',
    ownerName: '',
    contactNumber: '',
    businessType: ''
  });
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, { displayName: formData.fullName });
      // save role
      await saveUserRole(userCredential.user.uid, formData.accountType);
      // if employer, save extra profile
      if (formData.accountType === 'employer') {
        const profile = {
          companyName: formData.companyName,
          ownerName: formData.ownerName,
          contactNumber: formData.contactNumber,
          businessType: formData.businessType,
          email: formData.email
        };
        await saveEmployerProfile(userCredential.user.uid, profile);
      }
      setLoading(false);
      if (onSignUpSuccess) onSignUpSuccess(formData.accountType);
    } catch (err) {
      setLoading(false);
      if (err.code === 'auth/email-already-in-use') {
        setError('Account already exists with this email.');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
        <div className="absolute w-64 h-64 bg-blue-400/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl blur opacity-20 animate-pulse"></div>
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="absolute left-4 top-4 text-white bg-blue-700/80 hover:bg-blue-700 rounded-full px-3 py-1 text-sm font-medium shadow-md z-10"
          >
            ← Back
          </button>
          <div className="text-center mb-8 mt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Start your journey to dream career</p>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => handleInputChange('accountType', 'jobseeker')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                formData.accountType === 'jobseeker'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => handleInputChange('accountType', 'employer')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                formData.accountType === 'employer'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Employer
            </button>
          </div>

          {error && <div className="mb-4 text-red-400 text-center font-medium">{error}</div>}
          <div className="space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-200 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {formData.accountType === 'employer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Acme Pvt Ltd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Owner / HR Name</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Raj Sharma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Contact Number</label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., +91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Business Type</label>
                  <input
                    type="text"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Restaurant, Shop, Factory"
                  />
                </div>
              </div>
            )}

            <label className="flex items-start text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" className="mt-1 mr-2 rounded bg-white/10 border-white/20" />
              <span>
                I agree to the{' '}
              <a href="#" className="text-blue-300 hover:text-blue-200">Terms & Conditions</a>
                {' '}and{' '}
              <a href="#" className="text-blue-300 hover:text-blue-200">Privacy Policy</a>
              </span>
            </label>

            <button
              onClick={handleSubmit}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            className="w-full relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group overflow-hidden disabled:opacity-60"
              disabled={loading}
            >
              <span className="relative z-10 flex items-center">
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />}
              </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>

          <p className="text-center text-gray-300 mt-6">Already have an account? <button type="button" onClick={() => navigate('/signin')} className="text-blue-300 hover:text-blue-200 font-semibold transition-colors underline">Sign in</button></p>
        </div>
      </div>
    </div>
  );
}
