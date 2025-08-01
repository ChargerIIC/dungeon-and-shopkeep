import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    // FacebookAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    browserSessionPersistence
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// const facebookProvider = new FacebookAuthProvider(); //TODO: Lets users choose between Google and Facebook for authentication

interface AuthContextType {
    user: User | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        try {
            // Add persistence to keep user signed in
            await auth.setPersistence(browserSessionPersistence);
            const result = await signInWithPopup(auth, googleProvider);

            // Validate email domain if needed
            const email = result.user?.email;
            if (!email) {
                await firebaseSignOut(auth);
                throw new Error('Email is required for authentication');
            }

            // Additional security checks can be added here

        } catch (error: any) {
            console.error('Error signing in:', error);
            // Handle specific error types
            if (error.code === 'auth/popup-blocked') {
                throw new Error('Please enable popups for authentication');
            } else if (error.code === 'auth/cancelled-popup-request') {
                throw new Error('Authentication was cancelled');
            } else if (error.code === 'auth/unauthorized-domain') {
                throw new Error('This domain is not authorized for authentication');
            }
            throw error;
        }
    };

    const signOut = async () => {
        try {
            // Clear any sensitive data from localStorage
            localStorage.removeItem('shopName');
            localStorage.removeItem('items');

            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw new Error('Failed to sign out. Please try again.');
        }
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
