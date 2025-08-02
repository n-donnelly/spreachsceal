import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3Jtb1WspgJJfSthsgb3ltwH8ZPW9cl9c",
  authDomain: "novel-writing-ba5ac.firebaseapp.com",
  projectId: "novel-writing-ba5ac",
  storageBucket: "novel-writing-ba5ac.firebasestorage.app",
  messagingSenderId: "907178830396",
  appId: "1:907178830396:web:5327b061f18bf3cc71b139",
  measurementId: "G-64SLGDRT19"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);