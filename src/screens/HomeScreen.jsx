import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../ui_components/postcard";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "firebase/database";

export default function HomeScreen({navigation}) {
    const [postData, setPostData] = useState([]);
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const dbRef = ref(getDatabase(), "posts");

        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const postsArray = Object.values(data);
                setPostData(postsArray);
                // console.log(postsArray);
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
                // console.log(user)
                setUser(user);
              } else {
                console.log('No user is currently authenticated.');
              }
            } catch (error) {
              console.error('Error:', error);
              alert('An error occurred during authentication.');
            }
          }
    );

      

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topbar}>
                <Text style={styles.title}>TeenzConnect</Text>
                <View style={styles.profile}>
                    <TouchableOpacity onPress={() => {user ? navigation.navigate("MyProfile") : navigation.navigate("Login") }}>
                        <Ionicons name="person-circle" size={32} marginRight={10} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {user ? navigation.navigate("Settings") : alert("User not Authenticated !")}}>
                        <Ionicons name="settings" size={32} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{ marginBottom: 65, }}>
                {postData.map((post, index) => (
                    <PostCard
                        key={index}
                        username="KusaFuaza"
                        profileImageSource="https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg"
                        postTitle={post.text}
                        postImageSource={post.image}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {

    },
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
});
