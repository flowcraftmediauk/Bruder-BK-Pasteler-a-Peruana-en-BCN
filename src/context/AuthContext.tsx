import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';

const BOOTSTRAPPED_ADMIN_EMAIL = 'flowcraftmediauk@gmail.com';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  authError: string | null;
  signingIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      // Sync private user profile cleanly within schema bounds
      if (firebaseUser.emailVerified) {
        const userPath = `users/${firebaseUser.uid}`;
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const existingSnap = await getDoc(userRef);
          const safeDisplayName = (firebaseUser.displayName || 'Cliente')
            .trim()
            .slice(0, 120);
          const safeEmail = (firebaseUser.email || '').trim().slice(0, 160);
          const safePhoto = (firebaseUser.photoURL || '').trim().slice(0, 500);

          if (!existingSnap.exists()) {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              displayName: safeDisplayName || 'Cliente',
              email: safeEmail,
              photoURL: safePhoto,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } else {
            await updateDoc(userRef, {
              displayName: safeDisplayName || 'Cliente',
              photoURL: safePhoto,
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          // Log structured error without crashing public page rendering
          console.error('Error syncing user profile:', userPath, error);
        }

        // Check admin role via bootstrapped email or /admins/{uid}
        const isBootstrappedAdmin =
          firebaseUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL;
        if (isBootstrappedAdmin) {
          setIsAdmin(true);
        } else {
          try {
            const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
            setIsAdmin(adminSnap.exists());
          } catch {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
      if (message.includes('popup-closed-by-user')) {
        setAuthError('Inicio de sesión cancelado.');
      } else {
        setAuthError('No se pudo completar el acceso con Google. Inténtalo de nuevo.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const signOutUser = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'auth/signOut');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        authError,
        signingIn,
        signInWithGoogle,
        signOutUser,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  }
  return ctx;
}
