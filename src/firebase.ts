// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase configuration (Replace with your actual Firebase project config)
const firebaseConfig = {
  apiKey: "AIzaSyB52WbOA8wUIVfBAmWByV-JCykDh2aqgag",
  authDomain: "wedding-planner71.firebaseapp.com",
  projectId: "wedding-planner71",
  storageBucket: "wedding-planner71.firebasestorage.app",
  messagingSenderId: "701453380291",
  appId: "1:701453380291:web:30775f25cbfef1efdc1076",
  measurementId: "G-CVBB5CR8EJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const firestore = getFirestore(app); // Initialize Firestore
export const auth = getAuth(app); // Initialize Auth
