import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import customstyles from "../values/styles";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebase_auth, firebase_database, firebase_firestore } from "../config/firebaseConfig";
import { getDocs, setDoc, doc, collection, addDoc, getDoc, query, where } from "firebase/firestore";


const PostScreen = ({ navigation }) => {
    const [postText, setPostText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userdata, setUserdata] = useState(null);

    console.log("UserData: ", userdata);

    const uid = firebase_auth.currentUser?.uid;
    useEffect(() => {
        const fetchUserData = async () => {
            if (uid) {
                const userRef = collection(firebase_firestore, 'users');
                const q = query(userRef, where("uid", "==", uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setUserdata(doc.data());
                });
            }
        };

        fetchUserData();
    }, [uid]);


    const sendPost = async () => {
        setLoading(true);
        try {
            if (!selectedImage && !postText) {
                console.warn('No image or text provided for the post.');
                setLoading(false);
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
    
            // Generate a unique key for the post
            const uniqueKey = Date.now() + Math.floor(Math.random() * 100) + new Date().toISOString();
    
            // Construct the post data
            const postData = {
                title: postText,
                imageURL: downloadURL,
                user: uid,
                author_name: userdata.displayname,
                author_pic: userdata.profile_img,
                postId: uniqueKey,
                created: new Date(),
            }
    
            // Save the post data to the Firestore database
            const postRef = collection(firebase_firestore, 'posts');
            await addDoc(postRef, postData);
    
            console.log('Post saved successfully.');
    
            setLoading(false);
            setPostText(null);
            setSelectedImage(null);
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
                {loading ? <ActivityIndicator size="small" color="#991b1b" /> :
                    <TouchableOpacity onPress={sendPost}>
                        <Ionicons name="send" color="#991b1b" size={40} style={styles.icon} />
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
