import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import COLORS from '../../values/COLORS';
import { Button, Text, TextInput } from 'react-native-paper';
import userinfo from '../NewUserInfo';

const UsernameScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');

    const handleSignup = () => {
        userinfo.username = username;
        navigation.navigate("EmailScreen")
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/icon.png')} style={styles.logo} />
            <Image source={require('../../../assets/connect.png')} style={styles.logo} />
            <TextInput
                mode="outlined"
                label="Enter your Username"
                outlineColor='#991b1b'
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={styles.input}
            />

            <Button style={styles.button} mode="contained" buttonColor="#991b1b" onPress={handleSignup}>Next</Button>
            <Text style={styles.noAcc} onPress={() => {navigation.navigate("Login")}}>Have An Account .</Text>
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

export default UsernameScreen;
