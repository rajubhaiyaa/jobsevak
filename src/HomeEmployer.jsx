import React, { useState, useEffect } from 'react';
import { PlusCircle, List, Users, Edit2, UserCircle2 } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';

const TABS = [
  { key: 'post', label: '🧾 Post New Job', icon: <PlusCircle className="inline w-5 h-5 mr-1" /> },
  { key: 'jobs', label: '👀 View Posted Jobs', icon: <List className="inline w-5 h-5 mr-1" /> },
  { key: 'applicants', label: '📨 View Applicants', icon: <Users className="inline w-5 h-5 mr-1" /> },
  { key: 'edit', label: '✏️ Edit / Delete Jobs', icon: <Edit2 className="inline w-5 h-5 mr-1" /> },
];

export default function HomeEmployer({ onSignOut, onProfile }) {
  const [activeTab, setActiveTab] = useState('post');
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: '',
    salary: '',
    location: '',
    type: 'Full-time',
  });

  // Fetch employer profile on mount or when switching to profile tab
  useEffect(() => {
    if (activeTab === 'profile' && auth.currentUser) {
      setProfileLoading(true);
      getDoc(doc(db, 'employers', auth.currentUser.uid)).then(snap => {
        if (snap.exists()) setProfile(snap.data());
        setProfileLoading(false);
      });
    }
  }, [activeTab]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    await setDoc(doc(db, 'employers', auth.currentUser.uid), profile, { merge: true });
    setProfileEdit(false);
    setProfileLoading(false);
    setProfileMsg('Profile updated!');
    setTimeout(() => setProfileMsg(''), 2000);
  };

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

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Post job to Firestore
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    await addDoc(collection(db, 'jobs'), { ...form, applicants: [] });
    setForm({ title: '', description: '', skills: '', salary: '', location: '', type: 'Full-time' });
    setActiveTab('jobs');
  };

  // Delete job from Firestore
  const handleDeleteJob = async (id) => {
    await deleteDoc(doc(db, 'jobs', id));
  };

  // Edit job in Firestore
  const [editJobId, setEditJobId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', skills: '', salary: '', location: '', type: 'Full-time' });

  const startEditJob = (job) => {
    setEditJobId(job.id);
    setEditForm({
      title: job.title,
      description: job.description,
      skills: job.skills,
      salary: job.salary,
      location: job.location,
      type: job.type,
    });
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEditJob = async (id) => {
    await updateDoc(doc(db, 'jobs', id), { ...editForm });
    setEditJobId(null);
  };

  const cancelEditJob = () => {
    setEditJobId(null);
  };

  // Remove applicant from job in Firestore
  const handleApplicantAction = async (jobId, applicantId, action) => {
    const jobRef = doc(db, 'jobs', jobId);
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    const updatedApplicants = job.applicants.filter(a => a.id !== applicantId);
    await updateDoc(jobRef, { applicants: updatedApplicants });
    setJobs(jobs.map(job =>
      job.id === jobId
        ? { ...job, applicants: updatedApplicants }
        : job
    ));
    // Optionally handle accept/reject logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      {profileEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
            {profileMsg && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {profileMsg}
              </div>
            )}
            <form onSubmit={handleProfileSave}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={profile.companyName || ''}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={profile.industry || ''}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profile.website || ''}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setProfileEdit(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Header */}
  <header className="w-full bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <span className="text-2xl font-bold tracking-wide text-white drop-shadow-md">Employer Dashboard</span>
          <button
            onClick={onProfile}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-semibold text-white shadow transition border border-white/30"
          >
            <UserCircle2 className="w-5 h-5" /> Profile
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex gap-4 border-b border-white/30 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-all duration-200 focus:outline-none ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-700 via-pink-600 to-orange-400 text-white border-b-2 border-orange-400 shadow-lg'
                  : 'bg-white/20 text-white hover:text-orange-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
  <div className="bg-white/80 rounded-2xl shadow-xl p-8 min-h-[400px] text-gray-900">
          {/* Post New Job */}
          {activeTab === 'post' && (
            <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Job Title</label>
                <input name="title" value={form.title} onChange={handleFormChange} className="w-full px-4 py-2 rounded bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Location</label>
                <input name="location" value={form.location} onChange={handleFormChange} className="w-full px-4 py-2 rounded bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-gray-700 font-semibold">Job Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full px-4 py-2 rounded bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} required />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Required Skills</label>
                <input name="skills" value={form.skills} onChange={handleFormChange} className="w-full px-4 py-2 rounded bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Salary Range</label>
                <input name="salary" value={form.salary} onChange={handleFormChange} className="w-full px-4 py-2 rounded bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Employment Type</label>
                <select name="type" value={form.type} onChange={handleFormChange} className="w-full px-4 py-2 rounded bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Full-time</option>
                  <option>Part-time</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold text-white shadow transition">Post Job</button>
              </div>
            </form>
          )}

          {/* View Posted Jobs */}
          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-xl font-bold mb-6 text-blue-700">Your Posted Jobs</h2>
              <div className="space-y-6">
                {jobs.length === 0 && <div className="text-gray-400">No jobs posted yet.</div>}
                {jobs.map(job => (
                  <div key={job.id} className="bg-white rounded-xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-blue-100">
                    <div>
                      <div className="text-lg font-semibold text-blue-900">{job.title}</div>
                      <div className="text-gray-500">{job.location} • {job.type}</div>
                      <div className="text-gray-500 mt-1">{job.skills}</div>
                      <div className="text-blue-600 mt-2 font-bold">₹{job.salary}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Applicants */}
          {activeTab === 'applicants' && (
            <div>
              <h2 className="text-xl font-bold mb-6 text-blue-300">Applicants</h2>
              {jobs.length === 0 && <div className="text-gray-400">No jobs posted yet.</div>}
              {jobs.map(job => (
                <div key={job.id} className="mb-8">
                  <div className="font-semibold text-white mb-2">{job.title}</div>
                  {job.applicants && job.applicants.length > 0 ? (
                    <div className="space-y-4">
                      {job.applicants.map(applicant => (
                        <div key={applicant.id} className="bg-slate-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="text-white font-medium">{applicant.name}</div>
                            <div className="text-gray-400">Skill: {applicant.skill}</div>
                            <div className="text-gray-400">Contact: {applicant.contact}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleApplicantAction(job.id, applicant.id, 'accept')} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-white font-semibold">Accept</button>
                            <button onClick={() => handleApplicantAction(job.id, applicant.id, 'reject')} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-white font-semibold">Reject</button>
                            <button onClick={() => window.open(`mailto:${applicant.contact}`)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white font-semibold">Contact</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">No applicants yet.</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Edit / Delete Jobs */}
          {activeTab === 'edit' && (
            <div>
              <h2 className="text-xl font-bold mb-6 text-blue-300">Edit / Delete Jobs</h2>
              <div className="space-y-6">
                {jobs.length === 0 && <div className="text-gray-400">No jobs posted yet.</div>}
                {jobs.map(job => (
                  <div key={job.id} className="bg-slate-900 rounded-xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {editJobId === job.id ? (
                      <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => { e.preventDefault(); saveEditJob(job.id); }}>
                        <input name="title" value={editForm.title} onChange={handleEditFormChange} className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-600" required />
                        <input name="location" value={editForm.location} onChange={handleEditFormChange} className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-600" required />
                        <textarea name="description" value={editForm.description} onChange={handleEditFormChange} className="col-span-2 px-4 py-2 rounded bg-slate-800 text-white border border-slate-600" rows={2} required />
                        <input name="skills" value={editForm.skills} onChange={handleEditFormChange} className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-600" required />
                        <input name="salary" value={editForm.salary} onChange={handleEditFormChange} className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-600" required />
                        <select name="type" value={editForm.type} onChange={handleEditFormChange} className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-600">
                          <option>Full-time</option>
                          <option>Part-time</option>
                        </select>
                        <div className="col-span-2 flex gap-2 mt-2">
                          <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-white font-semibold">Save</button>
                          <button type="button" onClick={cancelEditJob} className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-full text-white font-semibold">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div>
                          <div className="text-lg font-semibold text-white">{job.title}</div>
                          <div className="text-gray-400">{job.location} • {job.type}</div>
                          <div className="text-gray-400 mt-1">{job.skills}</div>
                          <div className="text-blue-400 mt-2 font-bold">₹{job.salary}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEditJob(job)} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-full text-white font-semibold">Edit</button>
                          <button onClick={() => handleDeleteJob(job.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-white font-semibold">Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
