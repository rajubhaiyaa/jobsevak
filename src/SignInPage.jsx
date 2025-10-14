import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, getUserRole } from './firebase';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, Mail, Lock, ArrowRight } from 'lucide-react';

export default function SignInPage({ onBack, onSignInSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const role = await getUserRole(userCredential.user.uid);
      setLoading(false);
      if (onSignInSuccess) onSignInSuccess(role);
    } catch (err) {
      setLoading(false);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl blur opacity-20 animate-pulse"></div>
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <button onClick={onBack} className="absolute left-6 top-6 text-gray-300 hover:text-white">Back</button>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to continue your job search</p>
          </div>

          {error && <div className="mb-4 text-red-400 text-center font-medium">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-300 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded bg-white/10 border-white/20" />
                Remember me
              </label>
              <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group overflow-hidden disabled:opacity-60"
              disabled={loading}
            >
              <span className="relative z-10 flex items-center">
                {loading ? 'Signing In...' : 'Sign In'}
                {!loading && <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </form>

          <p className="text-center text-gray-300 mt-8">Don't have an account? <button type="button" onClick={() => navigate('/signup')} className="text-blue-300 hover:text-blue-200 font-semibold transition-colors underline">Sign up</button></p>
        </div>
      </div>
    </div>
  );
}
