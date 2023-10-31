import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import COLORS from '../../values/COLORS';
import { Button, Text, TextInput } from 'react-native-paper';
import userinfo from '../NewUserInfo';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebase from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';



const PasswordScreen = ({ navigation }) => {
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        const auth = getAuth();
        userinfo.password = password;
    
        try {
            // Create a new user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, userinfo.email, userinfo.password);
            const user = userCredential.user;
    
            // Initialize Firestore
            const db = getFirestore();
    
            // Define the data to be saved to Firestore
            const userData = {
                displayname: userinfo.username,
                email: userinfo.email,
                uid: user.uid || "",
                profile_img: "",
            };
    
            // Add the user data to a Firestore collection
            const userRef = collection(db, 'users');
            const newUserDoc = await addDoc(userRef, userData);
    
            console.log('User data saved to Firestore.');
            console.log('User email:', user.email);
            navigation.navigate("MainScreen");
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('That email address is already in use!');
            } else if (error.code === 'auth/invalid-email') {
                alert('That email address is invalid!');
            }
    
            console.error(error);
        }
    };
    

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/icon.png')} style={styles.logo} />
            <Text style={styles.heading}>Password</Text>
            <TextInput
                mode="outlined"
                label="Enter your Password"
                outlineColor='#991b1b'
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
            />

            <Button style={styles.button} mode="contained" buttonColor="#991b1b" onPress={handleSignup}>Next</Button>
            <Text style={styles.noAcc}>Have An Account .</Text>
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
    noAcc: {
        marginTop: 20,
        fontSize: 16,
    }
});

export default PasswordScreen;
