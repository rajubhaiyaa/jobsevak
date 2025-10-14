import React from 'react';

export default function Navbar({ onSignOut, isEmployer }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-xl font-bold">JobSevak</div>
          <div className="text-sm text-gray-50">{isEmployer ? 'Employer' : 'Job Seeker'}</div>
        </div>
        <div>
          <button onClick={onSignOut} className="text-sm text-purple-600 hover:underline">Sign out</button>
        </div>
      </div>
    </header>
  );
}
