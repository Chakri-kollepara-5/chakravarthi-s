import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { sendWelcomeEmail } from "../config/emailjs";

const googleProvider = new GoogleAuthProvider();

const getTimestamp = () => new Date().toISOString();

/**
 * 🔑 Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "User",
        role: "user",
        phone: user.phoneNumber || "",
        createdAt: getTimestamp(),
        isActive: true,
        photoURL: user.photoURL || "",
        lastLogin: getTimestamp(),
      };

      await setDoc(userRef, userData);

      try {
        await sendWelcomeEmail(user.email, userData.name, userData.role);
      } catch (emailError) {
        console.warn("Welcome email failed:", emailError);
      }
    } else {
      await setDoc(
        userRef,
        { lastLogin: getTimestamp() },
        { merge: true }
      );
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * ✉️ Sign up with Email & Password
 */
export const signUpWithEmailPassword = async (
  email,
  password,
  name,
  role = "user"
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const userData = {
      uid: user.uid,
      email: user.email,
      name: name || "User",
      role,
      phone: "",
      createdAt: getTimestamp(),
      isActive: true,
      photoURL: user.photoURL || "",
      lastLogin: getTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    try {
      await sendWelcomeEmail(user.email, userData.name, userData.role);
    } catch (emailError) {
      console.warn("Welcome email failed:", emailError);
    }

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

/**
 * 🔓 Sign in with Email & Password
 */
export const signInWithEmailPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    await setDoc(
      doc(db, "users", result.user.uid),
      { lastLogin: getTimestamp() },
      { merge: true }
    );

    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

/**
 * 🚪 Sign out
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * 🛡️ Get user role
 */
export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data().role || "user" : "user";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "user";
  }
};

/**
 * 👤 Get user data
 */
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists()
      ? userDoc.data()
      : { uid, role: "user", name: "User", email: "", isActive: true };
  } catch (error) {
    console.error("Error getting user data:", error);
    return { uid, role: "user", name: "User", email: "", isActive: true };
  }
};

/**
 * 👀 Auth state observer
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback); // ✅ unsubscribe available
};

/**
 * 🔄 Update user role (Admin only)
 */
export const updateUserRole = async (uid, newRole) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      { role: newRole, updatedAt: getTimestamp() },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};
