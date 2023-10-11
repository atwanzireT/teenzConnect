import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDatabase, ref as dbref , onValue, off } from "firebase/database";
import { getAuth } from "firebase/auth";
import "firebase/database";
import COLORS from "../values/COLORS";
import InspireCard from "../ui_components/inspireCard";
import customstyles from "../values/styles";


export default function InspireScreen({ navigation }) {
    const [postData, setPostData] = useState([]);
    const [user, setUser] = useState(null);
    const [likes, setLikes] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const dbRef = dbref(getDatabase(), "posts");

        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const postsArray = Object.values(data);
                // Reverse the postsArray
                const reversedPostsArray = postsArray.reverse();
                setPostData(reversedPostsArray);
            } else {
                setPostData([]);
            }
        });

        // Clean up the event listener when the component unmounts
        return () => {
            off(dbRef);
        };
    }, []);

    useEffect(() => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                setUser(user);
            } else {
                console.log('No user is currently authenticated.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during authentication.');
        }
    });
    
    return (
        <SafeAreaView>
            {/* <View style={styles.topbar}>
                <Text style={styles.title}>TeenzConnect</Text>
                <View style={styles.profile}>
                    <TouchableOpacity onPress={() => { user ? navigation.navigate("MyProfile") : navigation.navigate("Login") }}>
                        <Ionicons name="person-circle" size={32} marginRight={10} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { user ? navigation.navigate("Settings") : alert("User not Authenticated !") }}>
                        <Ionicons name="settings" size={32} color="black" />
                    </TouchableOpacity>
                </View>
            </View> */}
        
            <ScrollView style={{ marginTop:-20}}>
                <View style={[customstyles.grid, customstyles.space_between]}>
                {postData.map((post, index) => (
                    <InspireCard
                        key={index}
                        id={post.id}
                        profileImageSource="https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg"
                        postTitle={post.text}
                        postImageSource={post.image}
                        userid={post.user}
                        Like={likes}
                    />
                ))}
                </View>
            </ScrollView>
            {/* <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => {
                    navigation.navigate('Post')
                }}
            >
                <Ionicons name="add" size={40} color="white" />
            </TouchableOpacity> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },
    title: {
        fontSize: 24,
    },
    profile: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileText: {
        fontSize: 18,
        marginRight: 8,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.red_800,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});
