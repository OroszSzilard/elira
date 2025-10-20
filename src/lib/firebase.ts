// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "elira-67ab7.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "elira-67ab7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "elira-67ab7.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "156979876603",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
  // Check if we haven't already connected to emulators
  if (typeof window !== 'undefined' && !(window as any).__FIREBASE_EMULATORS_CONNECTED__) {
    console.log("Development environment, connecting to emulators...");
    
    try {
      // Connect to emulators with updated ports from firebase.json
      connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8088);
      connectFunctionsEmulator(functions, "localhost", 5003);
      connectStorageEmulator(storage, "localhost", 9199);
      
      // Mark as connected to prevent reconnection attempts
      (window as any).__FIREBASE_EMULATORS_CONNECTED__ = true;
    } catch (error) {
      console.warn("Emulators may already be connected:", error);
    }
  }
}

export default app;