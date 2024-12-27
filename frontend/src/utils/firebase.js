// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxlFL1XEqXLEFMYsn8q77osCpQaRh1q7Q",
  authDomain: "bulk-email-5c174.firebaseapp.com",
  projectId: "bulk-email-5c174",
  storageBucket: "bulk-email-5c174.firebasestorage.app",
  messagingSenderId: "451358769405",
  appId: "1:451358769405:web:add542aa9e051812173e94",
  measurementId: "G-X22ZPCZRVC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
