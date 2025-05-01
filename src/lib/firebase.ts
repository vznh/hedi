// lib/firebase
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const { app, db } = (() => {
  try {
    const _app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    const _db = getFirestore(_app);
    console.log("* INIT: Firebase was initialized successfully.");
    return { app: _app, db: _db };
  } catch (error) {
    let errorMessage = "";
    errorMessage += "*! Firebase initialization error.\n";
    errorMessage += error;
    console.error(errorMessage);

    throw new Error("*! Firebase initialization failed");
  }
})();

export { db, app as firebase };
