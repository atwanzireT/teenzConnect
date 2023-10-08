import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, View } from "react-native";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import customstyles from "../values/styles";
import { getStorage, ref as storageRef, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as databaseRef, push, set, onValue } from "firebase/database";
import { onAuthStateChanged, auth, getAuth } from "firebase/auth";
import { firebase_auth, firebase_database } from "../config/firebaseConfig";


const PostScreen = ({navigation}) => {
    const [postText, setPostText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userdata, setUserdata] = useState(null);

    console.log(userdata);
    const uid = firebase_auth.currentUser?.uid;
    useEffect(() => {
        const fetchUserData = async () => {
            if (uid) {
                const dbRef = databaseRef(firebase_database, `users/${uid}`);
                onValue(dbRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setUserdata(data);
                        console.log("User name:", data.displayname);
                    } else {
                        setUserdata(null);
                        console.log("No User Data Found.");
                    }
                });
            }
        };

        fetchUserData();
    }, [uid]);

    const sendPost = async () => {
        setLoading(true);
        try {
            if (!selectedImage && !text) {
                console.warn('No image or text provided for the post.');
                return;
            }

            const storage = getStorage();
            const storageReference = storageRef(storage, 'posts/' + selectedImage.uri.split('/').pop());

            // Upload the selected image to Firebase Storage
            const response = await fetch(selectedImage.uri);
            const blob = await response.blob();

            const uploadTask = uploadBytesResumable(storageReference, blob);

            // Wait for the image upload to complete
            await uploadTask;

            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(storageReference);

            console.log('Image uploaded successfully. Download URL:', downloadURL);

            // Now, save both the text and image download URL to Firebase Realtime Database
            const db = getDatabase();
            const postsReference = databaseRef(db, 'posts');

            const newPostRef = push(postsReference);
            const newPostKey = newPostRef.key;

            const postData = {
                id : newPostKey,
                user : userdata?.uid,
                author_img: userdata?.profile_img,
                author_name: userdata?.displayname,
                text: postText,  // If text is not provided, set it to an empty string
                image: downloadURL,
            };

            // Use set to set data at a specific path
            await set(newPostRef, postData);

            console.log('Post saved to Firebase Realtime Database:', postData);
            setLoading(false);
            setSelectedImage(null);
            setPostText(null);
            navigation.navigate("Home");

        } catch (error) {
            console.error('Error sending post:', error);
            setLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [7, 9],
                quality: 1,
            });

            if (!result.canceled) {
                const selectedAssets = result.assets;
                if (selectedAssets.length > 0) {
                    const selectedImage = selectedAssets[0];
                    setSelectedImage(selectedImage);
                }
            }
        } catch (error) {
            console.error("Error picking image:", error);
        }
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={[customstyles.grid, customstyles.my_10]}>
                <Image
                    style={styles.profileImage}
                    source={require("../../assets/profile.png")}
                />
                <Text style={[customstyles.textbold_800, styles.textstyle]}>Create Post</Text>
            </View>

            <ScrollView>
                <TextInput
                    placeholder="What is happening ..."
                    style={styles.postTextArea}
                    value={postText}
                    onChangeText={(postText) => setPostText(postText)}
                    multiline={true}
                />
                <View style={styles.imgcard}>
                    {selectedImage && <Image source={{ uri: selectedImage.uri }} style={styles.img} />}
                </View>
            </ScrollView>

            <View style={[customstyles.grid, customstyles.space_between, styles.icons]}>
                <View style={customstyles.grid}>
                    <TouchableOpacity>
                        <Ionicons name="image" onPress={pickImage} size={40} style={styles.icon} />
                    </TouchableOpacity>
                    <Ionicons name="play-circle" size={40} style={styles.icon} />
                    <Ionicons name="location" size={40} style={styles.icon} />
                </View>
                {loading ? <ActivityIndicator size="small" /> :
                    <TouchableOpacity onPress={sendPost}>
                        <Ionicons name="send" color = "#991b1b" size={40} style={styles.icon} />
                    </TouchableOpacity>}
            </View>
        </SafeAreaProvider >
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginHorizontal: 10,
    },
    imgcard: {
        width: "100%",
        height: undefined,
        aspectRatio: 7 / 9,
    },
    img: {
        flex: 1,
        resizeMode: "contain",
        borderRadius: 20
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textstyle: {
        fontSize: 24,
        textAlignVertical: "center",
    },
    postTextArea: {
        width: '100%',
        height: 100,
        marginBottom: 5,
        borderRadius: 4,
        fontSize: 18,
    },
    icons: {
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
        color: "#374151",
    },
});

export default PostScreen;
