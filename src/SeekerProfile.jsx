import React, { useState, useEffect } from 'react';
import { UserCircle2, PencilLine, CheckCircle2, XCircle } from 'lucide-react';
import { db, auth, storage } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

export default function SeekerProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    education: '',
    location: '',
    profilePic: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingImage, setEditingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  // Load profile
  useEffect(() => {
    if (!auth.currentUser) return;
    setLoading(true);

    // First, get user data from 'users' collection
    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const seekerDoc = await getDoc(doc(db, 'seekers', auth.currentUser.uid));
        
        // Combine data from both collections
        const userData = userDoc.exists() ? userDoc.data() : {};
        const seekerData = seekerDoc.exists() ? seekerDoc.data() : {};
        
        setProfile(prev => ({
          ...prev,
          // Default auth data
          name: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
          // User registration data
          phone: userData.phone || '',
          skills: userData.skills || '',
          experience: userData.experience || '',
          education: userData.education || '',
          location: userData.location || '',
          // Additional seeker profile data
          ...seekerData
        }));

        setLoading(false);
      } catch (err) {
        console.error('Error loading profile:', err);
        setMsg('Error loading profile');
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      setEditingImage(false);
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      let profilePicUrl = profile.profilePic;

      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const timestamp = Date.now();
        const storageRef = ref(storage, `seekers/${auth.currentUser.uid}/profile_${timestamp}.${fileExtension}`);
        const metadata = { contentType: imageFile.type };
        await uploadBytes(storageRef, imageFile, metadata);
        profilePicUrl = await getDownloadURL(storageRef);
      }

      const updatedProfile = {
        ...profile,
        profilePic: profilePicUrl,
        updatedAt: new Date().toISOString(),
      };

      // Update both collections
      await Promise.all([
        // Update registration data in users collection
        setDoc(doc(db, 'users', auth.currentUser.uid), {
          phone: profile.phone,
          skills: profile.skills,
          experience: profile.experience,
          education: profile.education,
          location: profile.location,
          updatedAt: new Date().toISOString()
        }, { merge: true }),
        // Update additional profile data in seekers collection
        setDoc(doc(db, 'seekers', auth.currentUser.uid), updatedProfile, { merge: true })
      ]);
      
      setProfile(updatedProfile);

      // Cleanup
      setImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      setEditingImage(false);
      setMsg('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setMsg(error.message || 'Error saving profile');
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Your Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-4">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border mb-2" />
            ) : profile.profilePic ? (
              <img src={profile.profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border mb-2" />
            ) : (
              <UserCircle2 className="w-24 h-24 text-gray-400 mb-2" />
            )}

            {editingImage ? (
              <input type="file" accept="image/*" onChange={handleImageChange} className="block" />
            ) : (
              <button
                type="button"
                onClick={() => setEditingImage(true)}
                className="mt-2 px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition"
              >
                {profile.profilePic ? 'Change Photo' : 'Add Photo'}
              </button>
            )}
          </div>

          {/* Profile Fields */}
          {['name', 'email', 'phone', 'skills', 'experience', 'education', 'location'].map(field => (
            <div key={field}>
              <label className="block mb-1 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                name={field}
                value={profile[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                type={field === 'email' ? 'email' : 'text'}
                placeholder={field === 'skills' ? 'e.g. Tailoring, Carpentry' : ''}
              />
            </div>
          ))}

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>

          {/* Message */}
          {msg && (
            <div className={`text-center mt-2 ${msg.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {msg}
            </div>
          )}
        </form>

        {/* Logout & Back Buttons */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-gray-200 text-gray-800 py-2 rounded-full font-semibold hover:bg-gray-300 transition"
        >
          Logout
        </button>
        <button
          onClick={() => navigate('/seeker')}
          className="w-full mt-2 bg-blue-100 text-blue-700 py-2 rounded-full font-semibold hover:bg-blue-200 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
