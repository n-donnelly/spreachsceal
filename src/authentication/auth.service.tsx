import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { app } from '../config/firebase';

const auth = getAuth(app);

export const authService = {
  // Register new user
  register: async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  // Sign in existing user
  login: async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  // Sign out
  logout: async () => {
    return signOut(auth);
  },

  // Subscribe to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};