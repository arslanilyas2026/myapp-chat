/**
 * Firebase Configuration
 *
 * ADMIN: Replace all placeholder values with your Firebase project credentials.
 * Found in: Firebase Console → Project Settings → Your apps → Web app → SDK setup
 *
 * Steps:
 *   1. Go to https://console.firebase.google.com
 *   2. Select your project (or create one)
 *   3. Project Settings → Add app → Web
 *   4. Copy the firebaseConfig object values into your .env file
 *   5. Enable Authentication → Phone (for OTP login)
 *   6. Enable Firestore Database
 */

import { getApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;

// Guard: only initialize Firebase when real credentials are present.
// Without this guard, initializeApp() throws with undefined values and
// crashes the entire app before any React rendering occurs.
const hasCredentials = typeof apiKey === "string" && apiKey.length > 0;

let auth: Auth;
let db: Firestore;

if (hasCredentials) {
  const firebaseConfig = {
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  // Avoid duplicate-app error on HMR reloads
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Placeholder exports — never actually called when hasCredentials is false
  // because useAuth and useChats guard on this flag before calling Firebase.
  auth = null as unknown as Auth;
  db = null as unknown as Firestore;
}

export { auth, db, hasCredentials };
