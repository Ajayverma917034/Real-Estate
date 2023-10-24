// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-esate.firebaseapp.com",
  projectId: "mern-esate",
  storageBucket: "mern-esate.appspot.com",
  messagingSenderId: "259282367444",
  appId: "1:259282367444:web:72d7e6db5537441f965c41",
  measurementId: "G-Z7TQCL8GDT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);