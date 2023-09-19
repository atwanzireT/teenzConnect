import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import COLORS from '../values/COLORS';
import { Button, Text, TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
          
        //   const response = await axios.post(
        //     "https://34f9-41-75-174-157.ngrok-free.app/v1/api/auth/login",
        //     {
        //       email,
        //       password,
        //     }
        //   );
        //   console.log({"data":data});
        //   const token = response.data.token;
        //   console.log(token);
      
        //   // Assuming a successful login returns a token, you can store it securely.
        //   // AsyncStorage is used here for token storage, and you should import it at the top of your component file.
        //   await AsyncStorage.setItem("authToken", token);
      
          // After successful login, navigate to the MainScreen.
          navigation.navigate("MainScreen");
        } catch (error) {
          // Handle authentication errors here.
          console.log(error);
          // You can show an error message to the user or perform other error handling actions.
        }
      };
      
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/icon.png')} style={styles.logo} />
            <Text style={styles.heading}>Login</Text>
            <TextInput
                mode="outlined"
                label="Email"
                outlineColor='#991b1b'
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
            />

            <TextInput
                mode="outlined"
                label="Password"
                outlineColor='#991b1b'
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true} // Hide password characters
                style={styles.input}
            />
            <Button style={styles.button} mode="contained" buttonColor="#991b1b" onPress={handleLogin}>Login</Button>
            <Button style={styles.noAcc} onPress={() => {navigation.navigate("UsernameScreen")}}>Don't Have An Account .</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    heading: {
        fontSize: 24,
        marginBottom: 16,
        color: "#991b1b",
    },
    input: {
        width: '100%',
        marginBottom: 10,
        borderRadius: 4,
    },
    button: {
        width: "100%",
    },
    logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    noAcc:{
        marginTop:20,
        fontSize:16,
    }
});

export default LoginScreen;
