import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDnzHLHN5aAlL-BejZ89q-Guo7sp0PvZ7E",
    authDomain: "teenzconnect-dc7fa.firebaseapp.com",
    projectId: "teenzconnect-dc7fa",
    storageBucket: "teenzconnect-dc7fa.appspot.com",
    messagingSenderId: "569735618793",
    appId: "1:569735618793:web:4e49aaee00b5ca54d95078"
}

const app = initializeApp(firebaseConfig);
const firebase_storage = getStorage(app);
const firebase_database = getDatabase(app);
const firebase_auth = getAuth(app);

export {
    firebaseConfig, firebase_database, firebase_storage, firebase_auth
}