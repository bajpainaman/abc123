// Firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Storage
import { getAnalytics } from 'firebase/analytics';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgWB7KvXdKaa88fad5qs6uv-bj_wlLtAU",
  authDomain: "entp209-d29cd.firebaseapp.com",
  projectId: "entp209-d29cd",
  storageBucket: "entp209-d29cd.appspot.com",
  messagingSenderId: "141999105775",
  appId: "1:141999105775:web:f654d57e95a2be2ef21d1a",
  measurementId: "G-1Z24ZHKQGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const analytics = getAnalytics(app);
const storage = getStorage(app); // Initialize Storage

// Export the services to use them in other files
export { auth, db, storage, analytics };
