import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi3fRqqx3w_fPRwNjJWjYg3YwqEVNiBqE",
  authDomain: "furrbaby-food-pantry-donations.firebaseapp.com",
  projectId: "furrbaby-food-pantry-donations",
  storageBucket: "furrbaby-food-pantry-donations.appspot.com",
  messagingSenderId: "780166765648",
  appId: "1:780166765648:web:a0d8402acbb39ba48e8555"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setUser({ ...user, isAdmin: userData?.isAdmin || false } as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, username: string) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (!user) {
      throw new Error("User creation failed");
    }
    
    await updateProfile(user, { displayName: username });
    
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      isAdmin: false,
    });
    
    console.log("User registered successfully:", user.uid);
  } catch (error) {
    console.error("Registration error:", error);
    throw error; // Re-throw the error to be caught in the Register component
  }
};


  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUsername = async (username: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: username });
      await setDoc(doc(db, 'users', auth.currentUser.uid), { username }, { merge: true });
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};