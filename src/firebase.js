// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzSFbtrcYOVnXe7okjdTQD8F8mNwaPwiE",
  authDomain: "cakeshop-4dadf.firebaseapp.com",
  projectId: "cakeshop-4dadf",
  storageBucket: "cakeshop-4dadf.firebasestorage.app",
  messagingSenderId: "469247535740",
  appId: "1:469247535740:web:79b8dd72eb8397cae5b7f9",
  measurementId: "G-JEHRE7MZVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, analytics };