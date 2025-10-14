
// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAPbB-cM3udItcvL5iUdLjWjkDmS9oCLpY",
  authDomain: "jobsevak-e77e2.firebaseapp.com",
  projectId: "jobsevak-e77e2",
  storageBucket: "jobsevak-e77e2.appspot.com",
  messagingSenderId: "967909996995",
  appId: "1:967909996995:web:aac216336730edfccc6576"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ------------------------
// Helper functions
// ------------------------

// Save user role (jobseeker | employer)
export async function saveUserRole(userId, role) {
  return setDoc(doc(db, 'users', userId), { role, createdAt: serverTimestamp() }, { merge: true });
}

// Save employer profile details
export async function saveEmployerProfile(userId, profile) {
  return setDoc(doc(db, 'employers', userId), { ...profile, createdAt: serverTimestamp() });
}

// Get user role
export async function getUserRole(userId) {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? snap.data().role : null;
}

// ------------------------
// Optional: Save seeker profile (used by SeekerProfile.jsx)
export async function saveSeekerProfile(userId, profile) {
  return setDoc(doc(db, 'seekers', userId), { ...profile, updatedAt: serverTimestamp() }, { merge: true });
}

// Optional: Load seeker profile
export async function getSeekerProfile(userId) {
  const snap = await getDoc(doc(db, 'seekers', userId));
  return snap.exists() ? snap.data() : null;
}
