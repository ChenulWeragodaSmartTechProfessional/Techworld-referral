

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyA8vQod9S2zFBDesSOOUyhAfcPJHh3052k",
  authDomain: "techworld-referral.firebaseapp.com",
  projectId: "techworld-referral",
  storageBucket: "techworld-referral.firebasestorage.app",
  messagingSenderId: "910229327974",
  appId: "1:910229327974:web:cc0855bfae9657e66d5da7",
  measurementId: "G-ZTB5P13HS8"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Set persistence to LOCAL so users stay logged in
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Persistence error:", error);
});

export default app;