
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import SignInPage from './SignInPage';
import HomeSeeker from './HomeSeeker';
import HomeEmployer from './HomeEmployer';
import EmployerProfile from './EmployerProfile';
import SeekerProfile from './SeekerProfile';
import SignUpPage from './SignUpPage';

function App() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<LandingPage onSignIn={() => navigate('/signin')} onSignUp={() => navigate('/signup')} />} />
      <Route path="/signin" element={<SignInPage onBack={() => navigate('/')} onSignInSuccess={(role) => navigate(role === 'employer' ? '/employer' : '/seeker')} />} />
      <Route path="/signup" element={<SignUpPage onBack={() => navigate('/')} onSignUpSuccess={(role) => navigate(role === 'employer' ? '/employer' : '/seeker')} />} />
      <Route path="/seeker" element={<HomeSeeker onSignOut={() => navigate('/')} onProfile={() => navigate('/seeker/profile')} />} />
      <Route path="/seeker/profile" element={<SeekerProfile />} />
      <Route path="/employer" element={<HomeEmployer onSignOut={() => navigate('/')} onProfile={() => navigate('/employer/profile')} />} />
      <Route path="/employer/profile" element={<EmployerProfile onSignOut={() => navigate('/')} onBack={() => navigate('/employer')} />} />
    </Routes>
  );
}

export default App;