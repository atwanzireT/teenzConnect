import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, View, ActivityIndicator, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../ui_components/postcard";
import { getAuth } from "firebase/auth";
import "firebase/database";
import COLORS from "../values/COLORS";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firebase_firestore } from "../config/firebaseConfig";
import { RefreshControl } from "react-native";
import { Text } from "react-native-paper";

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    topbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 5,
    },
    logoImg: {
        width: 100,
        height: "auto",
        justifyContent:"center",
        justifyContent: "center",
        resizeMode: 'contain',
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
        bottom: 60,
        right: 20,
        backgroundColor: COLORS.red_800,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
    logotxt: {
        fontSize: 20,
        alignItems: "center",
    }
});

export default function HomeScreen({ navigation }) {
    const [postData, setPostData] = useState([]);
    const [user, setUser] = useState(null);
    const [likes, setLikes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(true);

    const auth = getAuth();

    useEffect(() => {
        // Fetch posts from Firebase Firestore
        const fetchPosts = async () => {
            try {
                const postCollection = collection(firebase_firestore, 'posts');
                const querySnapshot = await getDocs(
                    query(postCollection, orderBy('created', 'desc'))
                );
                const posts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPostData(posts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };
        

        fetchPosts();
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
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };
    
    

    return (
        <SafeAreaView
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.red_800]}
            />
        }>
            <View style={styles.topbar}>
                {/* <Image source={require('../../assets/connect.png')} style={styles.logoImg} /> */}
                <Text  style={styles.logotxt}>TeenConnect</Text>
                <View style={styles.profile}>
                    <TouchableOpacity onPress={() => { user ? navigation.navigate("MyProfile") : navigation.navigate("Login") }}>
                        <Ionicons name="person-circle" size={32} marginRight={10} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { user ? navigation.navigate("Settings") : alert("User not Authenticated !") }}>
                        <Ionicons name="settings" size={32} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.red_800} />
                </View>
            ) : (
                <ScrollView style={{ marginTop: 10,  marginBottom:70}}>
                    {postData.map((post, index) => (
                        <PostCard
                            key={index}
                            id={post.postId}
                            username={post.author_name}
                            profileImageSource="https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg"
                            postTitle={post.title}
                            postImageSource={post.imageURL}
                            userid={user?.uid}
                            email = {user?.email}
                        // Like={likes}
                        />
                    ))}
                </ScrollView>
            )}

        </SafeAreaView>
    );
}
