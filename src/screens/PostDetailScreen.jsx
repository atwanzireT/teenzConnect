import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { ActivityIndicator, Text} from "react-native-paper";
import { collection, getDocs, where, query, addDoc, deleteDoc } from 'firebase/firestore';
import { firebase_firestore, firebase_auth } from '../config/firebaseConfig';
import Ionicons from "@expo/vector-icons/Ionicons";
import customstyles from "../values/styles";
import COLORS from "../values/COLORS";

export default function PostDetailScreen({ route }) {
    const [post, setPost] = useState({});
    const [userid, setUserId] = useState(null);
    const [liked, setLiked] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [userdata, setUserdata] = useState(null);
    const [comment, setComment] = useState([]);
    const [uid, setUid] = useState(null);

    const { postId } = route.params;

    console.log("Posts: ", post);

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

    const countLikes = async () => {
        const likeRef = collection(firebase_firestore, 'likes');
        const q = query(likeRef, where('user', '==', userid), where('post', '==', postId));

        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                // Like exists, delete it
                const likeDoc = querySnapshot.docs[0];
                setLiked(true)
            } else {
                setLiked(false);
            }
        } catch (error) {
            console.error("Error while querying Firestore:", error);
        }
    };

    const handleLike = async () => {
        const likeRef = collection(firebase_firestore, 'likes');
        const q = query(likeRef, where('user', '==', userid), where('post', '==', postId));

        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                // Like exists, delete it
                const likeDoc = querySnapshot.docs[0];
                await deleteDoc(likeDoc.ref);
                setLiked(false);
                console.log("Like deleted ...");
            } else {
                // Like doesn't exist, add it
                const likeData = {
                    user: userid,
                    post: postId,
                    liked: true,
                };
                await addDoc(likeRef, likeData);
                setLiked(true);
                console.log("Post liked ...");
            }
        } catch (error) {
            console.error("Error while querying Firestore:", error);
        }
    };

    useEffect(() => {
        countLikes();
    }, []);

    useEffect(() => {
        try {
            const uid = firebase_auth.currentUser?.uid;
            setUid(uid);
        } catch (error) {
            console.error("No Uid Found .")
        }
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


    useEffect(() => {
        const fetchUserPost = async () => {
            if (postId) {
                const postRef = collection(firebase_firestore, 'posts');
                const q = query(postRef, where("postId", "==", postId));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.size > 0) {
                    const postData = querySnapshot.docs[0].data();
                    setPost(postData);
                    setUserId(postData.user);
                }
            }
        };
        fetchUserPost();
    }, [postId]);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image
                    style={styles.postImage}
                    source={{ uri: post.imageURL }}
                />
                <View style={[styles.actions, customstyles.space_between]}>
                    <View style={styles.userInfo}>
                        <Image
                            style={styles.profileImage}
                            source={{ uri: 'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg' }}
                        />
                        <Text style={styles.commentText}>Comments</Text>
                        {/* <View style={styles.userInfoText}>
                            <Text style={styles.textBold800}>{post.author_name}</Text>
                            <Text>{post.title}</Text>
                        </View> */}
                    </View>
                    <View style={[styles.actions, customstyles.alignItems]}>
                        {/* <Text style={{ marginLeft: 5 }}>{likes}</Text> */}
                        <TouchableOpacity onPress={handleLike}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons
                                    name={liked ? "heart" : "heart-outline"}
                                    size={32}
                                    color={liked ? "#991b1b" : "black"}
                                />
                            </View>
                        </TouchableOpacity>
                        <Ionicons name="share-outline" size={30} style={[customstyles.ml_10]} color={"#000"} />
                    </View>
                </View>
                <View>
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
                </View>
              
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    outlineColor={COLORS.gray_300}
                    value={newComment}
                    onChangeText={(text) => setNewComment(text)}
                    multiline={true}
                />
                {loading ? <ActivityIndicator size="small" /> :
                    <TouchableOpacity onPress={handleNewComment}>
                        <Ionicons name="send" color="#991b1b" size={40} style={styles.icon} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        borderColor: "white",
        borderWidth: 2,
        bottom: 70,
    },
    commentText: {
        fontSize:20,
        fontWeight:"700",
        right:70,
        bottom: 18
    },
    userInfoText: {
        flex: 1,
    },
    textBold800: {
        fontWeight: "800",
    },
    postImage: {
        width: "100%",
        height: undefined,
        aspectRatio: 9 / 9,
    },
    actions: {
        flexDirection: "row",
        marginVertical: 5,
    },
    commentsContainer: {
        flex: 1,
        marginTop: 30,
        marginHorizontal: 10,
    },
    commentContainer: {
        flexDirection: "row",
        marginBottom:18,
        marginHorizontal:10,
        bottom:15,
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
    icon: {
        // Add any additional styles you need for the icon here
    },
});
