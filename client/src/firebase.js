import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNITrTJCZ_xogAaID5IEMuqxcnenNDgcs",
  authDomain: "repackwebite.firebaseapp.com",
  projectId: "repackwebite",
  storageBucket: "repackwebite.firebasestorage.app",
  messagingSenderId: "256944855215",
  appId: "1:256944855215:web:67be74b2ace94e7543dc5a",
  measurementId: "G-3JCQ0LYW92"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
