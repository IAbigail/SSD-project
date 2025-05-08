// src/authService.ts
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "./firebase"; // Import the already initialized auth

const googleProvider = new GoogleAuthProvider();

// Email/Password authentication
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing up:", error);
    throw error; // Re-throw to handle it in the UI
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Google authentication
export const loginWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await signOut(auth); // Sign out user
    console.log('User logged out successfully');
  } catch (error: any) {
    console.error("Error logging out:", error.message);
    throw new Error(error.message); // Re-throw to handle it in the UI
  }
};
