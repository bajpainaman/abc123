// Auth.js
import { auth } from './Firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification 
} from 'firebase/auth';

/**
 * Signs up a new user and sends a verification email.
 * Only allows emails from the 'drexel.edu' domain.
 *
 * @param {string} email - User's email address.
 * @param {string} password - User's chosen password.
 * @returns {Promise<void>}
 * @throws {Error} Throws error if signup fails or email domain is invalid.
 */
export const signup = async (email, password) => {
  // Normalize email to lowercase and trim whitespace
  email = email.trim().toLowerCase();

  // Validate email domain
  if (!email.endsWith('@drexel.edu')) {
    throw new Error('Only Drexel University email addresses are allowed.');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);

    // Optionally return user object or a success message
    return;
  } catch (error) {
    console.error('Signup error:', error);
    throw mapAuthError(error);
  }
};

/**
 * Signs in an existing user after verifying email.
 *
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<void>}
 * @throws {Error} Throws error if sign-in fails or email is not verified.
 */
export const signin = async (email, password) => {
  // Normalize email to lowercase and trim whitespace
  email = email.trim().toLowerCase();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      // Sign-in successful
      return;
    } else {
      // Send verification email again
      await sendEmailVerification(user);

      // Sign out to prevent access
      await signOut(auth);

      throw new Error('Email not verified. A new verification email has been sent.');
    }
  } catch (error) {
    console.error('Signin error:', error);
    throw mapAuthError(error);
  }
};

/**
 * Logs out the currently authenticated user.
 *
 * @returns {Promise<void>}
 * @throws {Error} Throws error if logout fails.
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to log out. Please try again.');
  }
};

/**
 * Maps Firebase authentication errors to user-friendly messages.
 *
 * @param {object} error - Error object from Firebase.
 * @returns {Error} Error with a user-friendly message.
 */
const mapAuthError = (error) => {
  let message = 'An unknown error occurred. Please try again.';
  switch (error.code) {
    case 'auth/email-already-in-use':
      message = 'This email address is already in use.';
      break;
    case 'auth/invalid-email':
      message = 'Please enter a valid email address.';
      break;
    case 'auth/weak-password':
      message = 'Password should be at least 6 characters.';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email.';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password. Please try again.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many unsuccessful login attempts. Please try again later.';
      break;
    default:
      if (error.message) {
        message = error.message;
      }
  }
  return new Error(message);
};
