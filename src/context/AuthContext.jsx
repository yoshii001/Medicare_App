import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase.js';
import { getUserRole, createUser } from '../services/database.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithEmail = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    } catch (error) {
      console.error("Firebase login error:", error.code, error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setUserRole(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          setUserRole(role);
          
          // Create user record if it doesn't exist
          if (!role || role === 'patient') {
            await createUser(user.uid, {
              name: user.displayName || 'User',
              email: user.email,
              role: 'patient'
            });
            setUserRole('patient');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('patient');
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signInWithEmail,
    signInWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};