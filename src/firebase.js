// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAINUfaT7oTkuJ7jMOqobmTGz1YT4CFh48",
  authDomain: "smart-box-17da6.firebaseapp.com",
  projectId: "smart-box-17da6",
  storageBucket: "smart-box-17da6.appspot.com",
  messagingSenderId: "583418027395",
  appId: "1:583418027395:web:2b6bb8eb76e5fc55ec6ab6",
  measurementId: "G-77JH63QXKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize analytics only if window is available
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, db, analytics };
