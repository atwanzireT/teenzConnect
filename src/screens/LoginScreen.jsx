import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

   
    const handleLogin = async () => {

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        setIsLoggingIn(true);

        const auth = getAuth();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setIsLoggedIn(true);

            await AsyncStorage.setItem('userLoggedIn', 'true');
            await AsyncStorage.setItem('uid', user.uid);
            await AsyncStorage.setItem('email', user.email);
            await AsyncStorage.setItem('password', password);

            navigation.navigate('MainScreen');
        } catch (error) {
            const errorMessage = error.message;
            setIsLoggingIn(false);
            alert(`Login failed: ${errorMessage}`);
        }

    };

    useEffect(() => {
        AsyncStorage.getItem('userLoggedIn').then((value) => {
            if (value === 'true') {
                setIsLoggedIn(true);
            }
        });
    }, []);


    return (
        <View style={styles.container}>

            <View style={{ alignItems: "center", width: "90%", marginHorizontal: 20 }}>
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
                {isLoggingIn ? (
                    <ActivityIndicator size="large" color="#991b1b" />
                ) : (
                    <>
                        <TouchableOpacity onPress={handleLogin}>
                            <Button style={styles.button} mode="contained" buttonColor="#991b1b" >Login</Button>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate("UsernameScreen") }}>
                            <Button style={styles.noAcc}>Don't Have An Account .</Button>
                        </TouchableOpacity>
                    </>

                )}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    heading: {
        fontSize: 24,
        marginBottom: 16,
        color: "#991b1b",
    },
    input: {
        width: "100%",
        marginBottom: 10,
        borderRadius: 4,
    },
    button: {
        width: "100%",
    },
    logo: {
        width: 90,
        height: 90,
        justifyContent: "center",
        resizeMode: 'contain',
    },
    noAcc: {
        marginTop: 20,
        fontSize: 16,
    }
});

export default LoginScreen;
