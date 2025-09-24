// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFiSQjRUyIxm4vcA_jGMuCEtivu0b218I",
  authDomain: "expedia-clone-local.firebaseapp.com",
  projectId: "expedia-clone-local",
  storageBucket: "expedia-clone-local.firebasestorage.app",
  messagingSenderId: "967552090766",
  appId: "1:967552090766:web:82c9683cb92990ebbfffdf",
  measurementId: "G-3LCDN1BYEG"
};

console.log("Firebase config:", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app.name);

// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

export default app;