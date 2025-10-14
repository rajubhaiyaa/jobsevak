import React from 'react';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
      <p className="text-gray-600 mt-2">⏱️ {course.duration}</p>
      <button 
        className={`mt-4 px-6 py-2 rounded-full transition-colors ${
          course.isFree 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {course.isFree ? 'Join Free' : 'Enroll Now'}
      </button>
    </div>
  );
}