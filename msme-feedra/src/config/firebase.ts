import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDH8o7rrgaJ5jdwkbwez-shDiifzeWquuU",
  authDomain: "food-saver-2524b.firebaseapp.com",
  projectId: "food-saver-2524b",
  storageBucket: "food-saver-2524b.firebasestorage.app",
  messagingSenderId: "378105291279",
  appId: "1:378105291279:web:ca546945e6e4f31b72f97a",
  measurementId: "G-PRN2PFP2E9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;