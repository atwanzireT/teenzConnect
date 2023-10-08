import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getDatabase, ref as databaseRef, push, set, onValue } from "firebase/database";
import { ScrollView, View, Image, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { firebase_auth, firebase_database } from "../config/firebaseConfig";

export default function CommentScreen({ route }) {
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [userdata, setUserdata] = useState(null);
    const [comment, setComment] = useState([]);

    const { id } = route.params;
    console.log(newComment);

    const uid = firebase_auth.currentUser?.uid;
    useEffect(() => {
        const fetchUserData = async () => {
            if (uid) {
                const dbRef = databaseRef(firebase_database, `users/${uid}`);
                onValue(dbRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setUserdata(data);
                    } else {
                        setUserdata(null);
                        console.log("No User Data Found.");
                    }
                });
            }
        };

        fetchUserData();
    }, [uid]);

    const handleNewComment = async () => {
        if (newComment.trim !== "") {
            setLoading(true);

            const CommentRef = databaseRef(firebase_database, 'comments');
            const newCommentRef = push(CommentRef);

            const newCommentdata = {
                postid: id,
                commenterUid: userdata?.uid,
                commenterName: userdata?.displayname,
                commenterImage: userdata?.profile_img,
                comment: newComment,
            }
            await set(newCommentRef, newCommentdata);
            setNewComment("");
            setLoading(false);

        } else {
            setLoading(false);
            console.log("No Comment !")
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            const CommentRef = databaseRef(firebase_database, 'comments');

            // Attach an event listener to the comments node
            onValue(CommentRef, (snapshot) => {
                const commentsData = snapshot.val();
                if (commentsData) {
                    const commentsArray = Object.values(commentsData);
                    const filteredData = commentsArray.filter(item => item.postid === id);
                    setComment(filteredData);
                } else {
                    setComment([]);
                }
            });
        };

        fetchComments();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.commentsContainer}>
                <Text style={styles.header}>Comments</Text>
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
