import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, View, Image, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { firebase_auth, firebase_database, firebase_firestore } from "../config/firebaseConfig";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";


export default function CommentScreen({ route }) {
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [userdata, setUserdata] = useState(null);
    const [comment, setComment] = useState([]);
    const [uid, setUid] = useState(null);

    const { postId } = route.params;
    console.log("userData: ", userdata);

    useEffect(() => {
        try {
            const uid = firebase_auth.currentUser?.uid;
            setUid(uid);
        } catch (error) {
            console.error("No Uid Found .")
        }

        const fetchUserData = async () => {
            try {
                const uid = firebase_auth.currentUser?.uid;
        
                if (uid) {
                    const userRef = collection(firebase_firestore, 'users');
                    const q = query(userRef, where("uid", "==", uid));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        setUserdata(doc.data());
                    });
                } else {
                    console.log('User ID is undefined.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        
        fetchUserData();
    }, [uid]);


    const handleNewComment = async () => {
        if (newComment.trim() !== "") {
            setLoading(true);

            // Create a reference to the 'comments' collection
            const commentsRef = collection(firebase_firestore, 'comments');

            // Create a new comment document
            const newCommentData = {
                postid: postId,
                commenterUid: userdata?.uid,
                commenterName: userdata?.displayname,
                commenterImage: userdata?.profile_img,
                comment: newComment,
            };

            // Add the new comment document to Firestore
            await addDoc(commentsRef, newCommentData);

            // Add the new comment to the comments list for immediate display
            setComment([...comment, newCommentData]);

            setNewComment("");
            setLoading(false);
        } else {
            setLoading(false);
            console.log("No Comment !");
        }
    }
    useEffect(() => {
        const fetchComments = async () => {
            const commentsRef = collection(firebase_firestore, 'comments');
            const q = query(commentsRef, where("postid", "==", postId));
            const querySnapshot = await getDocs(q);
            const commentsData = [];
            querySnapshot.forEach((doc) => {
                commentsData.push(doc.data());
            });
            setComment(commentsData);
        };

        fetchComments();
    }, [postId]);


    return (
        <View style={styles.container}>
            <ScrollView style={styles.commentsContainer}>
                {comment.map((cmt, index) => (
                    <View style={styles.commentContainer} key={index}>
                        <Image
                            source={{ uri: 'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg' }}
                            style={styles.commenterImage}
                        />
                        <View style={styles.commentTextContainer}>
                            <Text style={styles.commenterName}>{cmt.commenterName}</Text>
                            <Text>{cmt.comment}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={(text) => setNewComment(text)}
                    multiline={true}
                />
                {loading ? <ActivityIndicator size="small" /> :
                    <TouchableOpacity>
                        <Ionicons onPress={handleNewComment} name="send" color="#991b1b" size={40} style={styles.icon} />
                    </TouchableOpacity>
                }

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 16,
    },
    commentsContainer: {
        flex: 1,
        marginTop: 30,
        marginHorizontal: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    commentContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    commenterImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    commenterName: {
        fontWeight: "bold",
        marginBottom: 4,
    },
    commentTextContainer: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        borderWidth: 0, // Remove the border
        paddingHorizontal: 8,
        marginRight: 8,
    },
});
