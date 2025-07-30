// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB-soezoTDXSRuIAK1EGP0yCwvj5oeo_sk",
    authDomain: "chatroom-7a0e4.firebaseapp.com",
    projectId: "chatroom-7a0e4",
    storageBucket: "chatroom-7a0e4.firebasestorage.app",
    messagingSenderId: "355939038807",
    appId: "1:355939038807:web:7fbfb9bb5ccef39c175512"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore reference
const db = getFirestore(app);

export { db };