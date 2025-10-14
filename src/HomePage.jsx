import React from 'react';

export default function HomePage({ onSignOut }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">LocalJobs</h1>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md">Post a Job</button>
            <button onClick={onSignOut} className="px-4 py-2 border rounded-md">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-4">Welcome to your dashboard</h2>
        <p className="text-slate-600 mb-6">Here you'll see job recommendations, applications, and analytics.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Recommended Jobs</h3>
            <p className="text-sm text-slate-500">Jobs tailored to your profile and location.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Applications</h3>
            <p className="text-sm text-slate-500">Track and manage your applications.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Learning</h3>
            <p className="text-sm text-slate-500">Suggested courses to boost your skills.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
