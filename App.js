import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import UsernameScreen from './src/screens/SignupScreens/UsernameScreen';
import EmailScreen from './src/screens/SignupScreens/EmailScreen';
import PasswordScreen from './src/screens/SignupScreens/PasswordScreen';
import MainScreen from './src/screens/MainScreen';
import { firebaseConfig } from './src/config/firebaseConfig';
import MyProfileScreen from './src/screens/MyProfileScreen';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import SettingsScreen from './src/screens/SettingScreen';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentScreen from './src/screens/CommentScreen';
import PostScreen from './src/screens/PostScreen';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const getStoredUserData = async () => {
  try {
    const useremail = await AsyncStorage.getItem('email');
    const userpassword = await AsyncStorage.getItem('password');

    if (useremail && userpassword) {
      await signInWithEmailAndPassword(auth, useremail, userpassword);
      console.log(useremail, " ", userpassword);
      console.log("User logged in successfully.");
    } else {
      console.log("Email or password not found.");
    }
  } catch (error) {
    console.error(`Auto Login Failed: ${error.message}`);
  }
}

getStoredUserData();


const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setuser] = useState(null);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UsernameScreen" component={UsernameScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailScreen" component={EmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordScreen" component={PasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Comments" component={CommentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Post" component={PostScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {

  },
});
