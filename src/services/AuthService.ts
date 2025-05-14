import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signInWithPopup, GoogleAuthProvider, signOut, updateEmail } from "firebase/auth";
import { auth } from "../services/firebase"; 
import { FirebaseError } from "firebase/app";

const googleProvider = new GoogleAuthProvider();

// Email/Password authentication
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    return userCredential;
  } catch (error: any) {
    console.error("Error signing up:", error);
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('The email is already in use. Please try another one.');
        case 'auth/weak-password':
          throw new Error('The password is too weak. Please choose a stronger one.');
        default:
          throw new Error(error.message || 'An error occurred during sign-up.');
      }
    }
    throw error;
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
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error: any) {
    console.error("Error logging out:", error.message);
    throw new Error(error.message);
  }
};

// Change email
export const changeEmail = async (newEmail: string) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateEmail(user, newEmail);
      console.log("Email updated successfully.");
    }
  } catch (error: any) {
    console.error("Error changing email:", error);
    throw new Error(error.message || "An error occurred while changing email.");
  }
};
