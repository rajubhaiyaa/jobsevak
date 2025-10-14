import React, { useState, useEffect } from 'react';
import { UserCircle2, LogOut } from 'lucide-react';
import { auth, db } from './firebase';
import { getDoc, setDoc, doc } from 'firebase/firestore';

export default function EmployerProfile({ onSignOut, onBack }) {
  const [profile, setProfile] = useState({
    companyName: '',
    ownerName: '',
    contactNumber: '',
    businessType: '',
    email: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      setProfileLoading(true);
      getDoc(doc(db, 'employers', auth.currentUser.uid)).then(snap => {
        if (snap.exists()) setProfile(snap.data());
        setProfileLoading(false);
      });
    }
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-4">
      <div className="max-w-lg w-full bg-slate-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-300 flex items-center gap-2"><UserCircle2 className="w-7 h-7" /> Profile</h2>
        {profileLoading ? (
          <div className="text-gray-300">Loading...</div>
        ) : (
          <form onSubmit={handleProfileSave} className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-300 font-medium">Company Name</label>
              <input name="companyName" value={profile.companyName} onChange={handleProfileChange} className="w-full px-4 py-2 rounded bg-slate-900 text-white border border-slate-600" disabled={!profileEdit} />
            </div>
            <div>
              <label className="block mb-1 text-gray-300 font-medium">Owner Name</label>
              <input name="ownerName" value={profile.ownerName} onChange={handleProfileChange} className="w-full px-4 py-2 rounded bg-slate-900 text-white border border-slate-600" disabled={!profileEdit} />
            </div>
            <div>
              <label className="block mb-1 text-gray-300 font-medium">Contact Number</label>
              <input name="contactNumber" value={profile.contactNumber} onChange={handleProfileChange} className="w-full px-4 py-2 rounded bg-slate-900 text-white border border-slate-600" disabled={!profileEdit} />
            </div>
            <div>
              <label className="block mb-1 text-gray-300 font-medium">Business Type</label>
              <input name="businessType" value={profile.businessType} onChange={handleProfileChange} className="w-full px-4 py-2 rounded bg-slate-900 text-white border border-slate-600" disabled={!profileEdit} />
            </div>
            <div>
              <label className="block mb-1 text-gray-300 font-medium">Email</label>
              <input name="email" value={profile.email} onChange={handleProfileChange} className="w-full px-4 py-2 rounded bg-slate-900 text-white border border-slate-600" disabled={!profileEdit} />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={onBack} className="bg-slate-700 hover:bg-blue-700 px-4 py-2 rounded-full text-white font-semibold">← Back</button>
              {profileEdit ? (
                <>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-white font-semibold" disabled={profileLoading}>Save</button>
                  <button type="button" onClick={() => { setProfileEdit(false); setProfileMsg(''); }} className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-full text-white font-semibold">Cancel</button>
                </>
              ) : (
                <button type="button" onClick={() => setProfileEdit(true)} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-full text-white font-semibold">Edit Profile</button>
              )}
              <button type="button" onClick={onSignOut} className="ml-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-white font-semibold">Logout</button>
            </div>
            {profileMsg && <div className="text-green-400 font-medium mt-2">{profileMsg}</div>}
          </form>
        )}
      </div>
    </div>
  );
}
