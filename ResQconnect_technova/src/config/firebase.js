// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBjplt5LV5sTE6evYaFgTOXD_KP15COdyE",
  authDomain: "resqconnect-cd989.firebaseapp.com",
  projectId: "resqconnect-cd989",
 storageBucket: "resqconnect-cd989.appspot.com", // ✅ correct
  messagingSenderId: "1003727034686",
  appId: "1:1003727034686:web:225806534bb7e7a24e746f",
  measurementId: "G-B51RV12NZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

export { app, auth, db, storage, messaging, analytics };
