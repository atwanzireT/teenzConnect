import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import customstyles from "../values/styles";
import COLORS from "../values/COLORS";
import api_host from "../values/CONSTANTS";
// import { getDatabase, ref, set } from "firebase/database";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import * as FileSystem from 'expo-file-system';

const PostScreen = () => {
    const [text, setText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);


    const sendPost = async () => {
        try {
           
            const storage = getStorage();
            const storageRef = ref(storage, 'some-child');

            // 'file' comes from the Blob or File API
            uploadBytes(storageRef, file).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });
        } catch (error) {
            console.error('Error sending post:', error);
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
                <Text style={[customstyles.text_red_800, customstyles.textbold_800, styles.textstyle]}>Create Post</Text>
            </View>

            <ScrollView>
                <TextInput
                    placeholder="What is happening ..."
                    style={styles.postTextArea}
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
                <TouchableOpacity onPress={sendPost}>
                    <Ionicons name="send" size={40} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </SafeAreaProvider>
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
