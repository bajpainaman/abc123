// Auth.js
import { auth } from './Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

/**
 * Signs up a new user.
 * Only allows emails from the 'drexel.edu' domain.
 */
export const signup = async (email, password) => {
 /**
  if (!email.endsWith('@drexel.edu')) {
    throw new Error('Only Drexel University email addresses are allowed.');
  } */

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return the user object
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Signs in an existing user.
 */
export const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return the user object
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Logs out the currently authenticated user.
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Failed to log out. Please try again.');
  }
};
