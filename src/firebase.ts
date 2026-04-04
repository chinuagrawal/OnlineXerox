import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDp8xy-XDXRHvI1E_Q5bG67knFQUIwwEmM",
  authDomain: "onlinexerox.firebaseapp.com",
  projectId: "onlinexerox",
  storageBucket: "onlinexerox.firebasestorage.app",
  messagingSenderId: "756921104694",
  appId: "1:756921104694:web:06dff35a3e923fd07b5b97",
  measurementId: "G-9MYE3DDVDD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
