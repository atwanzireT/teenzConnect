import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../values/COLORS";
import customstyles from "../values/styles";
import { useNavigation } from "@react-navigation/native";
import { firebase_auth, firebase_firestore } from "../config/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const PostCard = (props) => {
  const { id, userid, email, username, postTitle, profileImageSource, postImageSource, likes } = props;
  const [liked, setLiked] = useState(false);
  const navigation = useNavigation();


  const handlePickPost = () => {
    navigation.navigate("Comments", { postId: id });
  };

  const handlePickUser = () => {
    navigation.navigate("UserProfile", { userId: userid });
  };

  const likesCollectionRef = collection(firebase_firestore, "likes");
  const likeQuery = query(
    likesCollectionRef,
    where("user", "==", userid),
    where("post", "==", id)
  );

  const checkIfUserLikedPost = async (userId, postId) => {
    try {
      const querySnapshot = await getDocs(likeQuery);
      setLiked(querySnapshot.docs.length > 0);
    } catch (error) {
      console.error("Error querying Firestore:", error.message);
      // Handle specific errors if needed
    }
  };

  const handleLike = async () => {
    const currentLikesCollectionRef = collection(firebase_firestore, "likes");
    const currentLikeQuery = query(
      currentLikesCollectionRef,
      where("user", "==", userid),
      where("post", "==", id)
    );
  
    try {
      const querySnapshot = await getDocs(currentLikeQuery);
  
      if (querySnapshot.docs.length > 0) {
        const likeDoc = querySnapshot.docs[0];
        await deleteDoc(likeDoc.ref);
        setLiked(false);
        console.log("Like deleted ...");
      } else {
        const likeData = {
          user: userid,
          post: id,
          liked: true,
          user_email: email,
        };
        await addDoc(currentLikesCollectionRef, likeData);
        setLiked(true);
        console.log("Post liked ...");
      }
    } catch (error) {
      console.error("Error while querying Firestore:", error);
    }
  };  

  useEffect(() => {
    checkIfUserLikedPost(userid, id);
  }, [userid, id]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickUser} style={styles.userInfo}>
        <Image
          style={styles.profileImage}
          source={{ uri: profileImageSource }}
        />
        <View style={styles.userInfoText}>
          <Text style={styles.textBold800}>{username}</Text>
          <Text>{postTitle}</Text>
        </View>
      </TouchableOpacity>
      <Image
        style={styles.postImage}
        source={{ uri: postImageSource }}
      />
      <View style={styles.actions}>
        <Text style={{ marginLeft: 5 }}>{likes}</Text>
        <TouchableOpacity onPress={handleLike}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={32}
              color={liked ? "#991b1b" : "black"}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickPost}>
          <Ionicons
            name="chatbubble-outline"
            style={customstyles.ml_10}
            size={30}
            color={"#000"}
          />
        </TouchableOpacity>
        <Ionicons name="share-outline" size={30} style={customstyles.ml_10} color={"#000"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
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
  txtbtn: {
    color: "#fff",
    backgroundColor: COLORS.red_800,
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default PostCard;
