// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnvNBhvGa9Jc28VzoiIX8EFD4KNSsVREQ",
  authDomain: "ozone-guard.firebaseapp.com",
  projectId: "ozone-guard",
  storageBucket: "ozone-guard.firebasestorage.app",
  messagingSenderId: "989543600269",
  appId: "1:989543600269:web:0ebc01b0a36de6aac412c4",
  measurementId: "G-BWLSVMPENC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services
export { app, auth, db, storage };