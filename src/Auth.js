// Auth.js
import { auth } from './Firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification 
} from "firebase/auth";

// Function for signing up and sending a verification email
export const signup = async (email, password) => {
  try {
    // Check if the email is from the 'drexel.edu' domain
    if (!email.endsWith('@drexel.edu')) {
      alert('Only Drexel University email addresses are allowed.');
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);  // Send verification email
    alert('Signup successful! Please verify your email before logging in. Check The Junk Folder in Oultook ');
  } catch (error) {
    console.error("Signup error:", error.message);
    alert(error.message);
  }
};

// Function for signing in
export const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user.emailVerified) {
      alert("Signin successful!");
    } else {
      alert("Please verify your email before signing in.");
    }
  } catch (error) {
    console.error("Signin error:", error.message);
    alert(error.message);
  }
};

// Function for logging out
export const logout = async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
  } catch (error) {
    console.error("Logout error:", error.message);
    alert(error.message);
  }
};
