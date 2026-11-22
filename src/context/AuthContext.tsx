import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useQuizStore, type RemoteSkinProfile } from '../store/quizStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://dervora-backend.vercel.app';

interface UserData {
  id: number;
  email: string;
  name: string | null;
  photoUrl: string | null;
}

interface AuthContextType {
  user: UserData | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUserWithBackend = async (currentFirebaseUser: FirebaseUser) => {
    try {
      const token = await currentFirebaseUser.getIdToken();

      const response = await fetch(`${BACKEND_URL}/api/auth/user-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to sync user with backend');
      }

      const result = await response.json();
      const loggedInUser: UserData | null = result.data?.user || result.user || null;
      const remoteSkinProfile: RemoteSkinProfile | null =
        result.data?.skinProfile ?? result.skinProfile ?? null;

      if (loggedInUser) {
        const accountKey = String(loggedInUser.id ?? loggedInUser.email);
        useQuizStore.getState().loadUserQuiz(accountKey, remoteSkinProfile);
      } else {
        useQuizStore.getState().clearActiveSession();
      }

      setUser(loggedInUser);
    } catch (error) {
      console.error('Error syncing user with backend:', error);
      useQuizStore.getState().clearActiveSession();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        await syncUserWithBackend(currentUser);
      } else {
        setUser(null);
        useQuizStore.getState().clearActiveSession();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      console.error('Google login failed:', error);
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        console.log('Login dibatalkan oleh pengguna');
      } else {
        alert('Login gagal. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      useQuizStore.getState().clearActiveSession();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};