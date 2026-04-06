import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase/config';

export const loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const logoutAdmin = () => signOut(auth);

export const subscribeToAuthChanges = (callback) => onAuthStateChanged(auth, callback);

export const sendAdminPasswordReset = (email) => sendPasswordResetEmail(auth, email);
