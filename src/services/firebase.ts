// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Your Firebase configuration (Replace with your actual Firebase project config)
const firebaseConfig = {
  apiKey: "AIzaSyB52WbOA8wUIVfBAmWByV-JCykDh2aqgag",
  authDomain: "wedding-planner71.firebaseapp.com",
  projectId: "wedding-planner71",
  storageBucket: "wedding-planner71.appspot.com", // Corrected Storage Bucket URL
  messagingSenderId: "701453380291",
  appId: "1:701453380291:web:30775f25cbfef1efdc1076",
  measurementId: "G-CVBB5CR8EJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Services
export const firestore = getFirestore(app); // Initialize Firestore
export const storage = getStorage(app); // Initialize Storage
export const auth = getAuth(app); // Initialize Auth

setPersistence(auth, browserLocalPersistence);
