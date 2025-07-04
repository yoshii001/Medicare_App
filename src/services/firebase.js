
import { initializeApp, getApps } from "firebase/app"; //
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

// Initialize default app
const app = initializeApp(firebaseConfig);

// Initialize secondary app for creating users without affecting current session
const secondaryApp =
    getApps().length < 2
        ? initializeApp(firebaseConfig, "Secondary")
        : getApps().find((a) => a.name === "Secondary");

const auth = getAuth(app);
const secondaryAuth = getAuth(secondaryApp);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Export
export { auth, database, secondaryAuth };
export default app;