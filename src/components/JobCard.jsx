import React from 'react';

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>💰 ₹{job.salary}/month</span>
            <span>📍 {job.location}</span>
          </div>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}