import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDS3qpoL07b2UOTbRJUFdBolMcby6yYvPQ",
  authDomain: "wellnests.firebaseapp.com",
  databaseURL: "https://wellnests-default-rtdb.firebaseio.com",
  projectId: "wellnests",
  storageBucket: "wellnests.firebasestorage.app",
  messagingSenderId: "498459735458",
  appId: "1:498459735458:web:b854e2083125b9ea82eefb",
  measurementId: "G-XZ42DR5576"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);

export default app;