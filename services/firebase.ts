
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your own Firebase project configuration.
// You can get this from the Firebase console for your project.
const firebaseConfig = {
  apiKey: "AIzaSyDvPa4wSTxHE84UTnlh8g8hx86_3sDq9zA",
  authDomain: "sardar-tv-pvt-ltd-59ec5.firebaseapp.com",
  projectId: "sardar-tv-pvt-ltd-59ec5",
  storageBucket: "sardar-tv-pvt-ltd-59ec5.firebasestorage.app",
  messagingSenderId: "322152926079",
  appId: "1:322152926079:web:537ac04270a62618aae84a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
