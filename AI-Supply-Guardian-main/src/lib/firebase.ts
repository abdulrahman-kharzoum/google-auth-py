import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Set persistence to LOCAL (survives page refresh and browser restart)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✅ Firebase auth persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('❌ Error setting persistence:', error);
  });

// Initialize Google Auth Provider with required scopes
export const googleProvider = new GoogleAuthProvider();

// Add scopes for Gmail, Calendar, Tasks, and Profile
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
googleProvider.addScope('https://www.googleapis.com/auth/calendar');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.addScope('https://www.googleapis.com/auth/tasks');

// Force account selection and request offline access for refresh token
googleProvider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

// Initialize Analytics (optional)
let analytics = null;
try {
  analytics = getAnalytics(app);
  console.log('✅ Firebase Analytics initialized');
} catch (error) {
  console.log('ℹ️ Firebase Analytics not available');
}

export { analytics };
export default app;

