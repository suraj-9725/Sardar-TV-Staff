
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

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

// Fix: Use compat API for initialization
// Initialize Firebase safely
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const auth = firebase.auth();
export const db = firebase.firestore();

// Create a secondary app for admin actions like creating users,
// to avoid logging out the current admin user.
const secondaryAppName = "secondaryAuthApp";
// Fix: Use compat API for secondary app initialization
const secondaryApp = firebase.apps.find(app => app.name === secondaryAppName) || firebase.initializeApp(firebaseConfig, secondaryAppName);

export const secondaryAuth = firebase.auth(secondaryApp);