import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBGILjor-sO9UeF304cGRF1zFw-5udTEzc",
    authDomain: "connect-21942.firebaseapp.com",
    projectId: "connect-21942",
    storageBucket: "connect-21942.appspot.com",
    messagingSenderId: "183779794423",
    appId: "1:183779794423:web:2d2871882be65b6d71a2f2"
}

const app = initializeApp(firebaseConfig);
const firebase_storage = getStorage(app);
const firebase_database = getDatabase(app);
const firebase_auth = getAuth(app);
const firebase_firestore = getFirestore(app);

export {
    firebaseConfig, firebase_database, firebase_storage, firebase_auth, firebase_firestore
}