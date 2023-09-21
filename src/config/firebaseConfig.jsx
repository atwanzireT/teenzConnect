import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDnzHLHN5aAlL-BejZ89q-Guo7sp0PvZ7E",
    authDomain: "teenzconnect-dc7fa.firebaseapp.com",
    projectId: "teenzconnect-dc7fa",
    storageBucket: "teenzconnect-dc7fa.appspot.com",
    messagingSenderId: "569735618793",
    appId: "1:569735618793:web:4e49aaee00b5ca54d95078"
}


export {
    firebaseConfig
}