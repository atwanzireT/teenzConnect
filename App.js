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
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UsernameScreen" component={UsernameScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailScreen" component={EmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordScreen" component={PasswordScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="PostScreen" component={PostScreen} options={{ headerShown: false }} /> */}
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {

  },
});