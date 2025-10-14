
import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import JobCard from './components/JobCard';
import CourseCard from './components/CourseCard';
import logo from '../logo.png';

export default function HomeSeeker({ onSignOut, onProfile }) {
  const dummyStories = [
    {
      id: 1,
      story: 'I found a tailoring job in my city through JobSevak. The platform made it easy to connect with local employers.',
      name: 'Aarti',
      location: 'Gorakhpur'
    },
    {
      id: 2,
      story: 'JobSevak helped me get my first job as a Data Entry Operator. The process was simple and quick.',
      name: 'Ravi',
      location: 'Lucknow'
    },
    {
      id: 3,
      story: 'I joined a free Spoken English course and improved my skills. Now I work as a receptionist.',
      name: 'Priya',
      location: 'Kanpur'
    },
    {
      id: 4,
      story: 'Thanks to JobSevak, I got a job in a local retail shop. The job alerts feature is very helpful.',
      name: 'Sunil',
      location: 'Varanasi'
    },
    {
      id: 5,
      story: 'I attended a job fair listed on JobSevak and got placed as a marketing executive.',
      name: 'Meena',
      location: 'Allahabad'
    },
    {
      id: 6,
      story: 'The skill development courses helped me learn MS Office and get an office assistant job.',
      name: 'Aman',
      location: 'Bareilly'
    },
    {
      id: 7,
      story: 'I switched careers from sales to graphic design after taking an online course recommended on JobSevak.',
      name: 'Neha',
      location: 'Agra'
    },
    {
      id: 8,
      story: 'JobSevak community discussions gave me confidence for interviews. I am now working in HR.',
      name: 'Rahul',
      location: 'Noida'
    },
    {
      id: 9,
      story: 'I found a remote job opportunity and now work from home as a customer support agent.',
      name: 'Kiran',
      location: 'Jhansi'
    },
    {
      id: 10,
      story: 'JobSevak helped me connect with local employers and get a job as a delivery executive.',
      name: 'Deepak',
      location: 'Gwalior'
    }
  ];
  const dummyCommunity = [
    {
      id: 1,
      title: 'Resume Tips for Freshers',
      description: 'Share your resume building tips and templates for new job seekers.'
    },
    {
      id: 2,
      title: 'Best Free Online Courses',
      description: 'Recommend free online courses for skill development.'
    },
    {
      id: 3,
      title: 'Interview Experiences',
      description: 'Share your interview stories and advice.'
    },
    {
      id: 4,
      title: 'Local Job Fairs',
      description: 'Post information about upcoming job fairs in your city.'
    },
    {
      id: 5,
      title: 'Work From Home Opportunities',
      description: 'Discuss remote job options and companies hiring for WFH.'
    },
    {
      id: 6,
      title: 'Skill Development Events',
      description: 'Announce workshops and webinars for learning new skills.'
    },
    {
      id: 7,
      title: 'Success Stories',
      description: 'Share your journey of getting a job through JobSevak.'
    },
    {
      id: 8,
      title: 'Government Schemes',
      description: 'Discuss government programs for employment and training.'
    },
    {
      id: 9,
      title: 'Freelancing Tips',
      description: 'Advice and resources for starting freelancing.'
    },
    {
      id: 10,
      title: 'Job Alerts & Notifications',
      description: 'How to get instant job alerts and stay updated.'
    }
  ];
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([
    {
      id: '1',
      name: 'Basic Computer Skills',
      duration: '2 weeks',
      isFree: true
    },
    {
      id: '2',
      name: 'Spoken English',
      duration: '1 month',
      isFree: true
    },
    {
      id: '3',
      name: 'Digital Marketing',
      duration: '3 weeks',
      isFree: false
    },
    {
      id: '4',
      name: 'MS Office Training',
      duration: '2 weeks',
      isFree: true
    },
    {
      id: '5',
      name: 'Tally Accounting',
      duration: '1 month',
      isFree: false
    },
    {
      id: '6',
      name: 'Web Development Basics',
      duration: '4 weeks',
      isFree: false
    },
    {
      id: '7',
      name: 'Retail Sales Training',
      duration: '2 weeks',
      isFree: true
    },
    {
      id: '8',
      name: 'Customer Service Skills',
      duration: '2 weeks',
      isFree: true
    },
    {
      id: '9',
      name: 'Graphic Design Basics',
      duration: '3 weeks',
      isFree: false
    },
    {
      id: '10',
      name: 'Entrepreneurship Essentials',
      duration: '1 month',
      isFree: true
    }
  ]);
  const [search, setSearch] = useState({ title: '', skill: '', location: '', experience: '' });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const navigate = useNavigate();
  // Section refs for smooth scroll
  const homeRef = useRef(null);
  const jobsRef = useRef(null);
  const coursesRef = useRef(null);
  const communityRef = useRef(null);

  // Real-time jobs from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'jobs'), (querySnapshot) => {
      const jobsData = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() });
      });
      setJobs(jobsData);
    });
    return () => unsub();
  }, []);

  // Filter jobs when search is active
  useEffect(() => {
    if (!searchActive) return;
    let results = jobs.filter(job => {
      const matchTitle = search.title ? job.title?.toLowerCase().includes(search.title.toLowerCase()) : true;
      const matchSkill = search.skill ? job.skills?.toLowerCase().includes(search.skill.toLowerCase()) : true;
      const matchLocation = search.location ? job.location?.toLowerCase().includes(search.location.toLowerCase()) : true;
      // Experience is not in job, but you can add logic if you store it
      return matchTitle && matchSkill && matchLocation;
    });
    setFilteredJobs(results);
  }, [search, jobs, searchActive]);

  // Scroll to section
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // Handle search button
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchActive(true);
    scrollToSection(jobsRef);
  };

  // Reset search
  const handleResetSearch = () => {
    setSearch({ title: '', skill: '', location: '', experience: '' });
    setSearchActive(false);
    setFilteredJobs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
  <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3">
                <img src={logo} alt="JobSevak Logo" className="h-10 w-10" />
                <span className="text-xl font-bold text-gray-900">JobSevak</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => scrollToSection(homeRef)} className="text-gray-700 hover:text-blue-600">Home</button>
                <button onClick={() => scrollToSection(jobsRef)} className="text-gray-700 hover:text-blue-600">Find Jobs</button>
                <button onClick={() => scrollToSection(coursesRef)} className="text-gray-700 hover:text-blue-600">Courses</button>
                <button onClick={() => scrollToSection(communityRef)} className="text-gray-700 hover:text-blue-600">Community</button>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-blue-600">For Employers ▾</button>
                  <div className="absolute hidden group-hover:block w-48 bg-white shadow-lg rounded-lg mt-2 py-2">
                    <button onClick={() => navigate('/employer/login')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">Employer Login</button>
                    <button onClick={() => navigate('/employer/register')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">Post a Job</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <form className="relative" onSubmit={handleSearch}>
                <input
                  type="text"
                  name="title"
                  value={search.title}
                  onChange={handleSearchChange}
                  placeholder="Search by skill, job title or location"
                  className="w-64 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400">🔍</button>
              </form>
              <button
                onClick={onProfile}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

  {/* Hero Section */}
  <div ref={homeRef} className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Connecting Local Talent with Local Opportunities</h1>
          <div className="flex gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100" onClick={() => navigate('/jobs')}>
              🧑‍💼 Find Jobs
            </button>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700" onClick={() => navigate('/employer/register')}>
              🏢 Post a Job
            </button>
          </div>
        </div>
      </div>

  {/* Job Search Section */}
  <div ref={jobsRef} className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                name="title"
                value={search.title}
                onChange={handleSearchChange}
                placeholder="Job Title"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="skill"
                value={search.skill}
                onChange={handleSearchChange}
                placeholder="Skill Type"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="location"
                value={search.location}
                onChange={handleSearchChange}
                placeholder="Location"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="experience"
                value={search.experience}
                onChange={handleSearchChange}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Experience Level</option>
                <option value="fresher">Fresher</option>
                <option value="experienced">Experienced</option>
              </select>
            </div>
            <div className="flex gap-4 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700">
                Search Jobs
              </button>
              {searchActive && (
                <button type="button" onClick={handleResetSearch} className="bg-gray-300 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-400">
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Featured Job Listings */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Job Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(searchActive ? filteredJobs : jobs).length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 text-lg py-12">
              {searchActive ? 'No matching jobs found.' : 'No jobs available.'}
            </div>
          ) : (
            (searchActive ? filteredJobs : jobs).map(job => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      </div>

  {/* Skill Development Courses */}
  <div ref={coursesRef} className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Skill Development Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>

      {/* Employers Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">🏢 Are You Hiring?</h2>
          <p className="text-xl mb-8">Post your jobs for free and connect with skilled local workers.</p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100"
          >
            Employer Login / Register
          </button>
        </div>
      </div>

  {/* Community Section */}
  <div ref={communityRef} className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Community</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dummyCommunity.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
              </div>
              <button className="mt-auto text-blue-600 font-medium" onClick={() => navigate('/community')}>Join Discussion →</button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyStories.map(story => (
              <div key={story.id} className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 italic mb-4">"{story.story}"</p>
                <p className="font-medium">- {story.name}, {story.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">JobSevak is India's local job platform, connecting job seekers and employers in every city. We help you find jobs, learn new skills, and grow your career.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/about')}>About</button></li>
                <li><button onClick={() => navigate('/contact')}>Contact</button></li>
                <li><button onClick={() => navigate('/privacy')}>Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms')}>Terms</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Find local jobs</li>
                <li>Skill development courses</li>
                <li>Community support</li>
                <li>Success stories</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Post jobs for free</li>
                <li>Find local talent</li>
                <li>Employer login/register</li>
                <li>Contact support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-2">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              </div>
              <p className="text-gray-400">support@jobsevak.in</p>
              <p className="text-gray-400 mt-2">Helpline: 1800-123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} JobSevak. All rights reserved.</p>
            <p className="mt-2">Empowering India's workforce, one job at a time.</p>
            <p className="mt-2">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
