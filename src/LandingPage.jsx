import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, BookOpen, MessageSquare, MapPin, Filter, Bell, Building, CheckCircle, TrendingUp, Award, Zap, ArrowRight, Star, Target, Sparkles, ChevronDown } from 'lucide-react';

import logo from '../logo.png';
// already using logo.png

export default function LandingPage({ onSignIn, onSignUp }) {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('seekers');
  const [showSignUpDropdown, setShowSignUpDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = {
    seekers: [
      { icon: <MapPin className="w-6 h-6" />, title: "Location-Based Jobs", desc: "Find opportunities near you with pincode/city search" },
      { icon: <Filter className="w-6 h-6" />, title: "Smart Filters", desc: "Filter by category, experience level, and skills" },
      { icon: <Zap className="w-6 h-6" />, title: "One-Click Apply", desc: "Apply directly from the app in seconds" },
      { icon: <Bell className="w-6 h-6" />, title: "Job Alerts", desc: "Get notifications for relevant opportunities" }
    ],
    employers: [
      { icon: <Building className="w-6 h-6" />, title: "Easy Posting", desc: "Create and manage job listings effortlessly" },
      { icon: <Users className="w-6 h-6" />, title: "Candidate Pool", desc: "Access qualified local talent instantly" },
      { icon: <CheckCircle className="w-6 h-6" />, title: "Smart Matching", desc: "AI-powered candidate recommendations" },
      { icon: <TrendingUp className="w-6 h-6" />, title: "Analytics", desc: "Track applications and engagement metrics" }
    ],
    learning: [
      { icon: <BookOpen className="w-6 h-6" />, title: "Free Courses", desc: "Access YouTube, Coursera, Skill India resources" },
      { icon: <Award className="w-6 h-6" />, title: "Certifications", desc: "Earn badges and certificates for skills" },
      { icon: <Target className="w-6 h-6" />, title: "Local Workshops", desc: "Join community learning events nearby" },
      { icon: <TrendingUp className="w-6 h-6" />, title: "Skill Tracking", desc: "Monitor your learning progress" }
    ],
    community: [
      { icon: <MessageSquare className="w-6 h-6" />, title: "Discussion Board", desc: "Connect with local job seekers" },
      { icon: <Users className="w-6 h-6" />, title: "Referral Network", desc: "Share opportunities and help others" },
      { icon: <Star className="w-6 h-6" />, title: "Mentorship Zone", desc: "Learn from experienced professionals" },
      { icon: <Sparkles className="w-6 h-6" />, title: "Success Stories", desc: "Get inspired by community wins" }
    ]
  };

  const stats = [
    { number: "50K+", label: "Active Jobs" },
    { number: "100K+", label: "Job Seekers" },
    { number: "10K+", label: "Companies" },
    { number: "85%", label: "Success Rate" }
  ];

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
      {/* Modern Header */}
      <header className="w-full bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Company Logo" className="h-12 w-16 object-contain" />
            <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">JobSevak</span>
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={onSignIn}
              className="px-5 py-2 rounded-full font-semibold bg-blue-800/80 border border-blue-400 text-blue-100 hover:bg-blue-700 transition-colors shadow"
            >
              Sign In
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSignUpDropdown((v) => !v)}
                className="px-5 py-2 rounded-full font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
              >
                Sign Up
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSignUpDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-blue-900 rounded-xl shadow-lg overflow-hidden z-10 border border-blue-400">
                  <button
                    onClick={() => { setShowSignUpDropdown(false); onSignUp('jobseeker'); }}
                    className="w-full text-left px-6 py-3 text-blue-200 font-semibold hover:bg-blue-800 transition-colors"
                  >
                    As Job Seeker
                  </button>
                  <button
                    onClick={() => { setShowSignUpDropdown(false); onSignUp('employer'); }}
                    className="w-full text-left px-6 py-3 text-indigo-200 font-semibold hover:bg-indigo-800 transition-colors"
                  >
                    As Employer
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
  <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-950">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-blue-700 bg-opacity-20 px-6 py-2 rounded-full border border-blue-400 border-opacity-30">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium text-blue-200">India's Local Job Revolution</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Find Your Dream Job
              <span className="block mt-2 text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">
                In Your City
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
              Connect with local employers, enhance your skills, and build your career with India's most trusted job platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button onClick={() => onSignUp && onSignUp()} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg transition-transform hover:scale-105">
                <span className="flex items-center gap-2">
                  Find Jobs Now
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>
              <button onClick={() => onSignUp && onSignUp()} className="px-8 py-4 border-2 border-white border-opacity-30 rounded-full font-semibold text-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                Post a Job
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-24 px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A complete ecosystem for job seekers, employers, and skill development
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'seekers', icon: <Briefcase className="w-5 h-5" />, label: 'Job Seekers' },
              { id: 'employers', icon: <Building className="w-5 h-5" />, label: 'Employers' },
              { id: 'learning', icon: <BookOpen className="w-5 h-5" />, label: 'Learning' },
              { id: 'community', icon: <MessageSquare className="w-5 h-5" />, label: 'Community' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                    : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features[activeTab].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-800 bg-opacity-50 backdrop-blur p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-24 px-6 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of successful job seekers and employers on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold text-lg hover:scale-105 transition-transform" onClick={() => navigate('/signup')}>
              <span className="flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
            <button className="px-8 py-4 border-2 border-white border-opacity-30 rounded-full font-semibold text-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-8 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; 2025 LocalJobs. Empowering India's workforce, one job at a time.</p>
        </div>
      </div>
    </div>
  );
}