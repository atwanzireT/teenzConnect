import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { firebase_auth } from '../config/firebaseConfig';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Please enter both email and password.');
            return;
        }

        setIsLoggingIn(true);

        const auth = getAuth();

        try {
            const userCredential = await signInWithEmailAndPassword(firebase_auth, email, password);
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
            Alert.alert(`Login failed: ${errorMessage}`);
        }
    };

    useEffect(() => {
        const getStoredUserData = async () => {
            try {
                setIsLoggingIn(true);
                const useremail = await AsyncStorage.getItem('email');
                const userpassword = await AsyncStorage.getItem('password');

                if (useremail && userpassword) {
                    setEmail(useremail);
                    setPassword(userpassword);
                    await signInWithEmailAndPassword(firebase_auth, useremail, userpassword);
                    console.log(useremail, " ", userpassword);
                    console.log("User logged in successfully.");
                    navigation.navigate('MainScreen');
                } else {
                    console.log("Email or password not found.");
                }
            } catch (error) {
                console.error(`Auto Login Failed: ${error.message}`);
            } finally {
                setIsLoggingIn(false);
            }
        };

        getStoredUserData();

        AsyncStorage.getItem('userLoggedIn').then((value) => {
            if (value === 'true') {
                setIsLoggedIn(true);
            }
        });
    }, [navigation]);


    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center", width: "90%", marginHorizontal: 20 }}>
                <Image source={require('../../assets/icon.png')} style={styles.logo} />
                <Image source={require('../../assets/connect.png')} style={styles.logoText} />
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
                    secureTextEntry={true}
                    style={styles.input}
                />
                {isLoggingIn ? (
                    <ActivityIndicator size="small" color="#991b1b" />
                ) : (
                    <View style={{ width: "100%" }}>
                        <TouchableOpacity onPress={handleLogin}>
                            <Button style={styles.button} mode="contained" buttonColor="#991b1b" >Login</Button>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate("UsernameScreen") }}>
                            <Button style={styles.noAcc} textColor='#991b1b'>Don't Have An Account .</Button>
                        </TouchableOpacity>
                    </View>

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
    logoText: {
        width: 90,
        height: 50,
        justifyContent: "center",
        resizeMode: 'contain',
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
